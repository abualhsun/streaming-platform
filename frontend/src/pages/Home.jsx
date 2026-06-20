import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiLogOut, FiUser } from 'react-icons/fi';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const [moviesRes, seriesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/movies', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/series', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setMovies(moviesRes.data.movies || []);
      setSeries(seriesRes.data.series || []);
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSeries = series.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-red-600">🎬 StreamHub</h1>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="ابحث عن فيلم أو مسلسل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded border border-gray-700 focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <FiUser />
              <span>{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              <FiLogOut /> تسجيل خروج
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Movies Section */}
            {filteredMovies.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-white">🎥 الأفلام</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredMovies.map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                  ))}
                </div>
              </section>
            )}

            {/* Series Section */}
            {filteredSeries.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-white">📺 المسلسلات</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredSeries.map(s => (
                    <SeriesCard key={s._id} series={s} />
                  ))}
                </div>
              </section>
            )}

            {filteredMovies.length === 0 && filteredSeries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">لم يتم العثور على نتائج</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
