import { Component,  OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpserviceService } from 'src/app/Services/httpServices/httpservice.service';

interface Currency {
  CurrencyCode: string;
  ExchangeRate: number;
  LedgerID: string;
}

interface Ledger {
  LedgerID: string;
  Description: string;
}


@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.css']
})
export class SalesInvoiceComponent {
  amount = '';
  keypadValue = '';
  activeField: string = '';

  displayedColumns: string[] = [
    'paymentOption', 'currency', 'ledger', 'exchangeRate',
    'amountGiven', 'invCurrAmount', 'lcAmount',
    'filter1', 'filter2', 'voutypes'
  ];

  paymentRows: any[] = [
    this.createEmptyRow()
  ];


  paymentOptions: string[] = ['Cash', 'Card'];
  currencies: Currency[] = [];
  currencyLedgers: Ledger[] = [];

  selectedPaymentOption = '';
  focusedInput: HTMLInputElement | null = null;

  selectedCurrency = '';
  selectedCurrencyLedger = '';
  rows: any[] = [
    {
      paymentOption: 'Cash',
      currency: '',
      ledger: '',
      filteredLedgers: [],
      exchangeRate: '',
      amountGiven: '',
      invCurrAmount: '',
      lcAmount: '',
      filter1: '',
      filter2: '',
      voutypes: ''
    }
  ];

  focusedField: string = '';
  focusedIndex: number = -1;

  voucherAmount: number = 0;
  paidAmount: number = 0;
  adjAmount: number = 0;
  dueAmount: number = 0;
  voucherInitialized: boolean = false;

  setFocusedField(field: string, index: number) {
    this.focusedField = field;
    this.focusedIndex = index;
  }

  keyPressed(key: string) {
    if (this.focusedField && this.focusedIndex >= 0) {
      const currentValue = this.rows[this.focusedIndex][this.focusedField] || '';
      if (key === 'Del') {
        this.rows[this.focusedIndex][this.focusedField] = currentValue.slice(0, -1);
      } else {
        this.rows[this.focusedIndex][this.focusedField] = currentValue + key;
      }
      if (this.focusedField === 'amountGiven') {
        this.recalculateSummary();
      }
    }
  }



  invoiceCurrencySummary = {
    voucherAmount: '',
    paidAmount: '',
    adjAmount: '',
    dueAmount: ''
  };

  baseCurrencySummary = {
    voucherAmount: '',
    paidAmount: '',
    adjAmount: '',
    dueAmount: ''
  };


  constructor(

    private dialogRef: MatDialogRef<SalesInvoiceComponent>,
    private service: HttpserviceService
  ) {}

  ngOnInit(): void {
    this.loadCurrencyData(101);
    this.recalculateSummary();

  }

  createEmptyRow() {
    return {
      paymentOption: '',
      currency: '',
      ledger: '',
      exchangeRate: '',
      amountGiven: '',
      invCurrAmount: '',
      lcAmount: '',
      filter1: '',
      filter2: '',
      voutypes: ''
    };
  }

  addRow() {
    this.rows.push(this.createEmptyRow());
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
    this.recalculateSummary();
  }


  loadCurrencyData(cid: number): void {

    const query = `cid=${cid}&TableName=${'CURRENCY'}&_FormType=${'""'}&_Condition=${'""'}&_MenuID=${'""'}&_WithInActive=true`;

    this.service.httpGet('/General/LoadMCCBWithLedger?' ,query)
    .subscribe(response => {
      console.log('Currency Response1:', response);
      if (response.errno === 0) {
        this.currencies  = response.respdata;

        const defaultCurrency = this.currencies.find(c => c.CurrencyCode === 'AED');
        if (defaultCurrency) {
          this.rows[0].currency = 'AED';  // Set currency


          this.loadLegderData(101,true);
        }
      }
    });
  }

  loadLegderData(cid: number,triggerChange: boolean = false): void {

    const query = `cid=${cid}&TableName=${'LedgerMaster'}&_FormType=${'LedgerAccount'}&_Condition=${"Category='Cash'"}&_MenuID=${'""'}&_WithInActive=${'true'}`;

    this.service.httpGet('/General/LoadMCCBWithLedger?' ,query)
    .subscribe(response => {
      console.log('Currency Response2:', response);
      if (response.errno === 0) {
        this.currencyLedgers = response.respdata;
        if (triggerChange && this.rows.length > 0) {
          this.onCurrencyChange(this.rows[0]);
        }
      }
    });
  }


  getLedgerForCurrency(currencyCode: string): Ledger | undefined {
    const currency = this.currencies.find(c => c.CurrencyCode === currencyCode);
    if (currency) {
      return this.currencyLedgers.find(l => l.LedgerID.toString() === currency.LedgerID);
    }
    return undefined;
  }

  onCurrencyChange(row: any) {
    const selectedCurrency = this.currencies.find(c => c.CurrencyCode === row.currency);
    console.log('Selected Currency:', selectedCurrency);

    if (selectedCurrency) {
      row.exchangeRate = selectedCurrency.ExchangeRate;

      // Parse the comma-separated list of ledger IDs
      const currencyLedgerIds = selectedCurrency.LedgerID
        ? selectedCurrency.LedgerID.split(',').map(id => id.trim())
        : [];

      console.log('Looking for LedgerIDs:', currencyLedgerIds);
      console.log('Available ledger IDs:', this.currencyLedgers.map(l => l.LedgerID));

      const matchedLedgers = this.currencyLedgers.filter(
        l => currencyLedgerIds.includes(String(l.LedgerID).trim())
      );

      console.log('Matched Ledgers:', matchedLedgers);

      row.filteredLedgers = matchedLedgers;

      row.ledger = matchedLedgers.length === 1 ? matchedLedgers[0].LedgerID : '';
    } else {
      row.exchangeRate = '';
      row.filteredLedgers = [];
      row.ledger = '';
    }
  }

  recalculateSummary() {
    // Sum of all rows' lCAmount
    this.paidAmount = this.rows.reduce((sum, row) => {
      return sum + (parseFloat(row.lcAmount) || 0);
    }, 0);

    const adj = parseFloat(this.adjAmount as any) || 0;
    this.dueAmount = parseFloat((this.voucherAmount - this.paidAmount - adj).toFixed(2));


  }

  onAdjAmountChange() {
    this.recalculateSummary();   // ✅ When Adj.Amount changes, call recalculateSummary

  }

  // onKeypadClick(value: string) {
  //   if (this.focusedInput) {
  //     if (value === 'Del') {
  //       // Remove last character
  //       this.focusedInput.value = this.focusedInput.value.slice(0, -1);
  //     } else {
  //       // Append the clicked value
  //       this.focusedInput.value += value;
  //     }

  //     // Update ngModel manually if needed
  //     const event = new Event('input', { bubbles: true });
  //     this.focusedInput.dispatchEvent(event);
  //   }
  // }

  // onInputFocus(event: any) {
  //   this.focusedInput = event.target;
  // }



  onEnter() {
    if (this.focusedIndex >= 0) {
      const row = this.rows[this.focusedIndex];
      const givenAmount = parseFloat(row.amountGiven);
      const exchangeRate = parseFloat(row.exchangeRate);
      // avoud doubke add row
      const isLastRow = this.focusedIndex === this.rows.length - 1;

      if (!isNaN(givenAmount)) {
        // First entry: initialize voucher amount
        if (!this.voucherInitialized) {
          if (this.voucherAmount === 0) {
            this.voucherAmount = givenAmount;
            row.amountGiven = '';
            this.voucherInitialized = true;
          }
        } else {
          // Subsequent entries
          row.invCurrAmount = givenAmount.toFixed(2);

          if (!isNaN(exchangeRate) && exchangeRate > 0) {
            const lcAmount = givenAmount * exchangeRate;
            row.lcAmount = lcAmount.toFixed(2);
          } else {
            row.lcAmount = '';
          }
        }

        this.recalculateSummary();
        this.dueAmount = parseFloat(this.dueAmount.toFixed(2));
        this.adjAmount = parseFloat(this.adjAmount.toFixed(2));

        if (isLastRow) {
          this.addRow();
        }
      }
    }
  }

OnCancel(){
  this.dialogRef.close();
}

onCloseDialog()
  {
    this.rows = [this.createEmptyRow()];

    this.voucherAmount = 0;
    this.paidAmount = 0;
    this.adjAmount = 0;
    this.dueAmount = 0;
    this.voucherInitialized = false;

    this.dialogRef.close({ event: 'CLEAR' });
  }

OnProceed() {

}

  // When user focuses a field,
  setActiveField(fieldName: string) {
    this.activeField = fieldName;
    this.keypadValue = '';
  }
}
