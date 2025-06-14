import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitted(true);
    setError('');
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Google Map */}
      <div className="absolute inset-0 z-0">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed/v1/view?key=AIzaSyA26SLopuCcY_MNgtC9vIk4KffEmEaDhDI&center=18.5204,73.8567&zoom=10&maptype=roadmap"
          className="w-full h-full pointer-events-none brightness-75 blur-sm"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-sm"></div>
      </div>

      {/* Form Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white shadow-2xl p-8 rounded-2xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Forgot Password</h2>
          <p className="mb-6 text-gray-600 text-sm">
            Enter your registered email to receive password reset instructions.
          </p>

          {submitted ? (
            <div className="text-green-600 font-medium">
              ✅ A reset link has been sent to <strong>{email}</strong>.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <a href="/" className="text-red-700 hover:underline">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
