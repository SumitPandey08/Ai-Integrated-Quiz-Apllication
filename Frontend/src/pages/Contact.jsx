import React from 'react';
import image from '../assets/image.png'; // Logo import

const Contact = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: `url(https://i.pinimg.com/originals/88/3b/2a/883b2a6dad11501a861af208c9480c97.jpg)` }}
    >
      <div className="text-center p-12 max-w-3xl bg-black bg-opacity-80 rounded-2xl shadow-2xl relative z-10">
        <div className="flex justify-center mb-6">
          <img src={image} alt="Site Logo" className="h-16 w-auto object-contain" />
        </div>
        <h1 className="text-4xl font-extrabold mb-6 text-blue-400 tracking-wide">
          Contact Us
        </h1>
        <p className="text-lg mb-4 text-gray-300 leading-relaxed">
          We'd love to hear from you! Whether you have questions, feedback, or need support, please don't hesitate to reach out.
        </p>
        <div className="mb-8">
          <p className="text-2xl font-semibold text-white">
            Get in Touch
          </p>
          <div className="mt-4">
            <p className="text-gray-300">
              Email: <a href="mailto:support@aiquizzes.com" className="text-blue-400 hover:underline">support@aiquizzes.com</a>
            </p>
            <p className="text-gray-300">
              Phone: +1 (555) 123-4567 (Optional)
            </p>
            <p className="text-gray-300">
              Address: 123 Learning Lane, Quizville (Optional)
            </p>
          </div>
        </div>
        <hr className="border-gray-700 mb-8" />
        <div className="space-y-4">
          <p className="text-2xl font-semibold text-white">
            Send Us a Message
          </p>
          <form className="mt-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="text-white px-8 py-4 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;