import React from 'react';

const faqs = [
  {
    question: 'How do I sign up for an account?',
    answer: 'You can sign up by visiting our registration page and filling out the required information.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept online payment systems like UPI Only.'
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Yes, we prioritize the security and privacy of our users. We use encryption and secure protocols.'
  },
  {
    question: 'How can I contact customer support?',
    answer: 'You can contact our customer support team through Help Page on our website.'
  },
  
];

function FAQ() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 ">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="mb-6 text-5xl font-extrabold text-center text-gray-800">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="pb-4 border-b border-gray-300">
              <h2 className="mb-2 text-lg font-semibold text-gray-700">{faq.question}</h2>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;
