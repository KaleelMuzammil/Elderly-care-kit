import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

const BooksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Alchemist",
      author: "Paulo Coelho",
      coverImage: "https://via.placeholder.com/150",
      audioSample: "https://www.example.com/sample.mp3",
      url: "https://www.amazon.com/Alchemist-Paulo-Coelho/dp/0062315005",
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      coverImage: "https://via.placeholder.com/150",
      audioSample: "https://www.example.com/sample2.mp3",
      url: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299",
    },
  ]);
  const [filteredBooks, setFilteredBooks] = useState(books);
  const router = useRouter();

  const handleSearch = () => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleBookClick = (url: string) => {
    router.push(url);
  };

  return (
    <div>
      <Head>
        <title>Books and Audiobooks</title>
      </Head>

      <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">Explore Books and Audiobooks</h1>
        <div className="flex items-center mt-4">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for books"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-48 object-cover"
                onClick={() => handleBookClick(book.url)}
                style={{ cursor: 'pointer' }}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{book.title}</h2>
                <p className="text-gray-600 mb-4">by {book.author}</p>
                <audio controls className="w-full">
                  <source src={book.audioSample} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <button
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => handleBookClick(book.url)}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BooksPage;