import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (registerData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">🎬 StreamHub</h1>
          <p className="text-gray-400">انضم إلينا اليوم</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">إنشاء حساب جديد</h2>

          {error && (
            <div className="bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-300 mb-2">الاسم الكامل</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleChange}
                  placeholder="أحمد محمد"
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded border border-gray-700 focus:border-red-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded border border-gray-700 focus:border-red-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-300 mb-2">رقم الهاتف (اختياري)</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleChange}
                  placeholder="+964..."
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded border border-gray-700 focus:border-red-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 mb-2">كلمة المرور</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={registerData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 text-white pl-10 pr-10 py-2 rounded border border-gray-700 focus:border-red-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 mb-2">تأكيد كلمة المرور</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 text-white pl-10 pr-10 py-2 rounded border border-gray-700 focus:border-red-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition disabled:opacity-50"
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-400 mt-6">
            هل لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-red-600 hover:text-red-400 font-bold">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
