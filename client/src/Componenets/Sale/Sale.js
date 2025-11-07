import React, { useState, useEffect } from 'react';
import './Sale.css';
import { useToken } from '../../TokenContext';
import Main from "../Main/Main.js";

function Sale({ user }) {
    const { token } = useToken();
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [tag, setTag] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:4500/api/products");
                const data = await response.json();
                if (response.ok) setProducts(data.products);
                else setError(data.message);
            } catch (e) {
                setError(e.message);
            }
        };
        fetchProducts();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("price", price);
        formData.append("tags", tag);
        if (file) formData.append("image", file);

        try {
            const response = await fetch("http://localhost:4500/api/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setError("");
            } else {
                setError(data.message);
                setMessage("");
            }
        } catch (e) {
            setError(e.message);
            setMessage("");
        }
    };

    return (
        <div className="sale-container">
            <div className="sale-form">
                <form onSubmit={handleSubmit}>
                    <p className="sale-now-text">Sale Now</p>
                    <div className="user-info"><h2>Welcome, {user}</h2></div>
                    <div className="products-det-sale">
                        <label>Product Name:</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter product name" />
                        <label>Product Price:</label>
                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" />
                        <label>Product Tag:</label>
                        <select value={tag} onChange={(e) => setTag(e.target.value)}>
                            <option value="Sofas">Sofas</option>
                            <option value="Living">Living</option>
                            <option value="Bedroom">Bedroom</option>
                            <option value="Storage">Storage</option>
                            <option value="Outdoor">Outdoor</option>
                            <option value="Study & Office">Study & Office</option>
                            <option value="Sale">Sale</option>
                        </select>
                        <label>Upload Image:</label>
                        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                    <div className="btn-calculate">
                        <button type="submit">Submit</button>
                    </div>
                    {message && <div className="succesfull-message">{message}</div>}
                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>
            <div className="sales-list">
                <h2>Products for Sale</h2>
                {products.length > 0 ? products.map((product) => (
                    <Main key={product._id} product={{
                        ...product,
                        imageUrl: `http://localhost:4500/${product.filename}`
                    }} />
                )) : <p>No products for sale yet.</p>}
            </div>
        </div>
    );
}

export default Sale;
