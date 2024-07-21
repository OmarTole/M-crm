
const InputField = ({ label, type, name, value, onChange, error }) => (
    <>
        <p>{label}: </p>
        <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            className={error ? "error" : ""}
        />
        {error && <span className="error">{error}</span>}
    </>
);

export default InputField;
