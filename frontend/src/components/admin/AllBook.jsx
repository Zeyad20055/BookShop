import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AllBook() {
  const [bookList, setBookList] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/getBooks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.status === 401 || res.status === 403) {
          navigate("/", { replace: true });
          return;
        }

        const data = await res.json();

        console.log(data);

        setBookList(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    run();
  }, [navigate]);

  const handleEdit = (id) => {
    navigate(`/admin/updateBook/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("متأكد إنك عايز تحذف الكتاب ده؟");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await fetch(`http://localhost:5000/books/delateBook/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        navigate("/", { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error("فشل الحذف");
      }

      setBookList((prev) => prev.filter((book) => book._id !== id));
    } catch (error) {
      console.log("Error:", error);
      alert("حصل خطأ أثناء حذف الكتاب");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">All Books</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {bookList.map((book) => (
          <div
            key={book._id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col bg-white"
          >
            <img
              src={`http://localhost:5000/images/${book.coverImage}`}
              alt={book.title}
              className="w-full h-48 object-cover rounded-lg"
            />

            <h3 className="mt-3 font-semibold text-lg line-clamp-1">{book.title}</h3>

            <p className="text-gray-500 text-sm">{book.author}</p>

            <p className="text-[#f86d72] font-bold mt-1">${book.price}</p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(book._id)}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                تعديل
              </button>

              <button
                onClick={() => handleDelete(book._id)}
                disabled={deletingId === book._id}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-[#f86d72] hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === book._id ? "جاري الحذف..." : "حذف"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {bookList.length === 0 && (
        <p className="text-gray-400 text-center mt-10">لا توجد كتب حالياً</p>
      )}
    </div>
  );
}

export default AllBook;