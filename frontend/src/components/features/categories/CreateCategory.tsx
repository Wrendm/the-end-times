import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../../api/categoryApi";
import { AuthContext } from "../../../context/authcontext";

const types = ['Text', 'Image', 'Audio', 'Video'] as const;

type CategoryTypeOption = typeof types[number];

type CategoryForm = {
    name: string;
    type: "" | CategoryTypeOption;
    published: boolean;
};

export default function CreateCategory() {
    const [form, setForm] = useState<CategoryForm>({
        name: "",
        type: "",
        published: false,
    });
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext not found");

    if (auth.loading) {
        return <div className="loader"></div>;
    }

    if (!auth.user) {
        return <div>Not authenticated</div>;
    }

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/admin");
            }, 2000);

            return () => clearTimeout(timer); // cleanup
        }
    }, [success, navigate]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const isPublished = auth.user?.roles.includes("Admin") ? form.published : false;

            const payload = {
                name: form.name,
                type: form.type,
                published: isPublished,
            };

            await createCategory(payload);

            setSuccess(true);
            setError("");
            setForm({ name: "", type: "", published: false });
        } catch (err: any) {
            const res = err.response?.data;
            setError(res?.message || "Creation failed");
            setErrors(Array.isArray(res?.errors) ? res.errors : []);
        }
    };

    return (
        <div className="Form">
            {auth.user.roles.includes("Admin") && success && <div className="success">Category Created!</div>}
            {!auth.user.roles.includes("Admin") && success && <div className="success">Category Submitted!</div>}
            {error && (
                <div className="error">
                    <h2>Error!</h2>
                    <h3>{error}</h3>
                    {errors.length > 0 && (
                        <ul>
                            {errors.map((errMsg, i) => (
                                <li key={i}>{errMsg}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {auth.user.roles.includes("Admin") && (
                <h1>Create Category</h1>)}
            {!auth.user.roles.includes("Admin") && (<>
                <h1>Request a Category</h1>
                <p>Your category will be added pending admin approval</p></>
            )}
            <form onSubmit={handleSubmit}>
                <label>Medium Name</label>
                <input name="name" value={form.name} onChange={handleChange} />
                <label>Medium Format</label>
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                >
                    <option value="">Select a type</option>

                    {types.map((type) => (
                        <option value={type} key={type}>
                            {type}
                        </option>
                    ))}
                </select>
                {auth.user.roles.includes("Admin") && (
                    <>
                        <label>Published</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="published"
                                    value="true"
                                    checked={form.published === true}
                                    onChange={() => setForm({ ...form, published: true })}
                                />
                                True
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="published"
                                    value="false"
                                    checked={form.published === false}
                                    onChange={() => setForm({ ...form, published: false })}
                                />
                                False
                            </label>
                        </div>
                    </>
                )}

                <button className="fullWidth-btn" type="submit">Submit Category</button>
            </form>
        </div>
    );
}