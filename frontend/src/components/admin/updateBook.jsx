import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    discountPercentage: "0",
    isFeatured: false,
    isOnSale: false,
    coverImage: null,
  });

  // جلب الأقسام
  useEffect(() => {
    fetch("http://localhost:5000/category/getCategory", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  // جلب بيانات الكتاب
  useEffect(() => {
    const getBook = async () => {
      try {
        const res = await fetch(`http://localhost:5000/books/getBook/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to get book");
        }

        const data = await res.json();

        setForm({
          title: data.title || "",

          author: data.author || "",

          description: data.description || "",

          price: data.price || "",

          stock: data.stock || "",

          category: data.category?._id || data.category || "",

          discountPercentage: data.discountPercentage || "0",

          isFeatured: data.isFeatured || false,

          isOnSale: data.isOnSale || false,

          coverImage: null,
        });

        if (data.coverImage) {
          setPreview(`http://localhost:5000/images/${data.coverImage}`);
        }
      } catch (error) {
        console.log(error);

        setMsg("خطأ في تحميل بيانات الكتاب");
      } finally {
        setLoading(false);
      }
    };

    getBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file") {
      const image = files[0];

      setForm((prev) => ({
        ...prev,

        coverImage: image,
      }));

      if (image) {
        setPreview(URL.createObjectURL(image));
      }
    } else {
      setForm((prev) => ({
        ...prev,

        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    const formData = new FormData();

    formData.append("title", form.title);

    formData.append("author", form.author);

    formData.append("description", form.description);

    formData.append("price", form.price);

    formData.append("stock", form.stock);

    formData.append("category", form.category);

    formData.append("discountPercentage", form.discountPercentage);

    formData.append("isFeatured", form.isFeatured);

    formData.append("isOnSale", form.isOnSale);

    if (form.coverImage) {
      formData.append("coverImage", form.coverImage);
    }

    try {
      const res = await fetch(
        `http://localhost:5000/books/updateBook/${id}`,

        {
          method: "PUT",

          credentials: "include",

          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("تم تعديل الكتاب بنجاح");

      navigate("/admin/all-book");
    } catch (error) {
      console.log(error);

      setMsg(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">جاري تحميل البيانات...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Update Book</h2>

      {msg && <p className="text-red-500 text-center mb-4">{msg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border p-3 rounded" />

        <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="w-full border p-3 rounded" />

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-3 rounded" />

        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full border p-3 rounded" />

        <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="w-full border p-3 rounded" />

        <input type="number" name="discountPercentage" value={form.discountPercentage} onChange={handleChange} placeholder="Discount" className="w-full border p-3 rounded" />

        <select name="category" value={form.category} onChange={handleChange} className="w-full border p-3 rounded">
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input ref={fileInputRef} type="file" name="coverImage" onChange={handleChange} className="w-full border p-3 rounded" />

        {preview && <img src={preview} className="w-40 h-40 object-cover rounded" />}

        <label>
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> Featured
        </label>

        <label className="block">
          <input type="checkbox" name="isOnSale" checked={form.isOnSale} onChange={handleChange} /> On Sale
        </label>

        <button disabled={submitting} className="w-full bg-slate-900 text-white py-3 rounded">
          {submitting ? "جاري التعديل..." : "Update Book"}
        </button>
      </form>
    </div>
  );
}

export default UpdateBook;
