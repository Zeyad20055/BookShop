import React, { useEffect, useRef, useState } from "react";

function AddBook() {
  const [categories, setCategories] = useState([]);
  const [msg, setMsg] = useState("");
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
    discountPercentage: "",
    isFeatured: false,
    isOnSale: false,
    coverImage: null,
  });

  useEffect(() => {
    fetch("http://localhost:5000/category/getCategory", {
      credentials: "include", // مهم عشان يبعت الكوكي مع الطلب
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => {
        console.log(err);
        setMsg("تعذر تحميل الأقسام، سجل دخولك تاني");
      });
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file") {
      const image = files[0];

      setForm({
        ...form,
        [name]: image,
      });

      setPreview(image ? URL.createObjectURL(image) : null);
      return;
    } else {
      setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
      });
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMsg("");

    if (!form.title.trim()) return setMsg("Title is required");
    if (!form.author.trim()) return setMsg("Author is required");
    if (!form.description.trim()) return setMsg("Description is required");
    if (!form.price || Number(form.price) <= 0) return setMsg("Price is required");
    if (!form.stock || Number(form.stock) < 0) return setMsg("Stock is required");
    if (!form.category) return setMsg("Select category");
    if (!form.coverImage) return setMsg("Select image");

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "discountPercentage" && value === "") {
        formData.append(key, 0);
        return;
      }
      formData.append(key, value);
    });

    try {
      setSubmitting(true);

      const res = await fetch("http://localhost:5000/books/createBook", {
        method: "POST",
        credentials: "include", // مهم عشان يبعت الكوكي مع الطلب
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add book");
      }

      setMsg("Book Added Successfully");

      setForm({
        title: "",
        author: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        discountPercentage: "",
        isFeatured: false,
        isOnSale: false,
        coverImage: null,
      });

      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setMsg(error.message || "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Add New Book</h2>

      {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Book Title" value={form.title} onChange={handleChange} className="w-full border p-3 rounded" />
        <input type="text" name="author" placeholder="Author" value={form.author} onChange={handleChange} className="w-full border p-3 rounded" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border p-3 rounded" />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="w-full border p-3 rounded" />
        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} className="w-full border p-3 rounded" />
        <input type="number" name="discountPercentage" placeholder="Discount Percentage" value={form.discountPercentage} onChange={handleChange} className="w-full border p-3 rounded" />

        <select name="category" value={form.category} onChange={handleChange} className="w-full border p-3 rounded">
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input ref={fileInputRef} type="file" name="coverImage" accept="image/*" onChange={handleChange} className="w-full border p-3 rounded" />

        {preview && <img src={preview} alt="preview" className="w-40 h-40 object-cover rounded mt-3" />}

        <label className="flex gap-2">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
          Featured
        </label>

        <label className="flex gap-2">
          <input type="checkbox" name="isOnSale" checked={form.isOnSale} onChange={handleChange} />
          On Sale
        </label>

        <button disabled={submitting} className="w-full bg-slate-900 text-white py-3 rounded">
          {submitting ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}

export default AddBook;