import { Component,  } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: false
})
export class FaqComponent   {

  faqs = [
    { question: 'What services does your company provide?', answer: 'Our company offers a comprehensive range of services, including custom software development, mobile app development, web development, cloud solutions, IT consulting, and ongoing support and maintenance.' },
    { question: 'What makes your company different from others in the industry?', answer: 'Our company stands out due to our commitment to quality, customer-centric approach, and agile development methodology.' },
    { question: 'How long have you been in business?', answer: 'We have been in business for over [insert number] years, successfully completing numerous projects across various industries.' },
    { question: 'Do you provide custom software solutions?', answer: 'Yes, we specialize in providing custom software solutions tailored to the specific requirements of our clients.' },
    { question: 'What is your software development process?', answer: 'Our software development process follows an agile methodology, which includes requirement gathering, design, development, testing, deployment, and maintenance.' },
    { question: 'How do you handle project changes or scope adjustments?', answer: 'We understand that project requirements can evolve and have a structured change request process to manage this.' },
    { question: 'How do you manage client expectations throughout the project?', answer: 'We prioritize transparency and regular communication with our clients to align expectations and build trust.' },
    { question: 'What industries do you serve?', answer: 'We serve a diverse range of industries, including healthcare, finance, e-commerce, education, and more.' },
    { question: 'What technologies do you work with?', answer: 'We work with a variety of technologies, including Java, .NET, Python, JavaScript, React, Angular, and cloud platforms like AWS and Azure.' },
    { question: 'Can you provide references or case studies?', answer: 'Yes, we can provide references and case studies upon request.' },
    { question: 'What is your pricing model?', answer: 'Our pricing model is flexible and can be tailored to fit your project needs.' },
    { question: 'Do you offer post-launch support and maintenance?', answer: 'Yes, we offer comprehensive post-launch support and maintenance services.' },
    { question: 'How do you ensure the security of the software you develop?', answer: 'We prioritize security at every stage of the development process.' },
    { question: 'What is the typical timeline for a project?', answer: 'The timeline for a project varies based on its complexity and scope.' },
    { question: 'How can I get started with your services?', answer: 'Getting started is easy! Simply contact us through our website or give us a call to schedule a consultation.' },
  ];


}
