// Signin.tsx
import { useState } from "react"
import { useTRPC } from "../../utils/trpc"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f7f7f5",
        fontFamily: "'Georgia', serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        backgroundColor: "#fff",
        border: "1px solid #e8e8e4",
        borderRadius: "12px",
        padding: "40px 36px",
        width: "100%",
        maxWidth: "400px",
    },
    heading: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#1a1a1a",
        letterSpacing: "-0.4px",
        margin: "0 0 6px 0",
    },
    subtext: {
        fontSize: "13px",
        color: "#999",
        margin: "0 0 32px 0",
    },
    formRow: {
        marginBottom: "16px",
    },
    label: {
        display: "block",
        fontSize: "11px",
        fontWeight: "600",
        color: "#999",
        letterSpacing: "0.8px",
        textTransform: "uppercase" as const,
        marginBottom: "6px",
    },
    input: {
        width: "100%",
        fontSize: "14px",
        color: "#1a1a1a",
        border: "1px solid #e8e8e4",
        borderRadius: "7px",
        padding: "10px 12px",
        outline: "none",
        boxSizing: "border-box" as const,
        fontFamily: "inherit",
        backgroundColor: "#fafaf8",
    },
    btn: {
        width: "100%",
        marginTop: "8px",
        padding: "11px",
        fontSize: "14px",
        borderRadius: "7px",
        border: "none",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        cursor: "pointer",
        fontFamily: "inherit",
        fontWeight: "600",
    },
    footer: {
        marginTop: "24px",
        fontSize: "13px",
        color: "#999",
        textAlign: "center" as const,
    },
    link: {
        color: "#1a1a1a",
        fontWeight: "600",
        textDecoration: "none",
        marginLeft: "4px",
    },
}

const Signin = () => {
    const trpc = useTRPC()
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const signinMutation = useMutation(trpc.user.signin.mutationOptions({
        onSuccess: (data) => {
            setUsername("")
            setPassword("")
            localStorage.setItem("token", data?.token)
            navigate("/dashboard")
        },
        onError: (data) => alert(data?.message),
    }))

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.heading}>Welcome back</h1>
                <p style={styles.subtext}>Sign in to continue to your todos</p>

                <div style={styles.formRow}>
                    <label style={styles.label}>Email</label>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="xyz@gmail.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div style={styles.formRow}>
                    <label style={styles.label}>Password</label>
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    style={{ ...styles.btn, opacity: signinMutation.isPending ? 0.6 : 1 }}
                    disabled={signinMutation.isPending}
                    onClick={() => signinMutation.mutate({ username, password })}
                >
                    {signinMutation.isPending ? "Signing in..." : "Sign in"}
                </button>

                <p style={styles.footer}>
                    Don't have an account?
                    <Link to="/signup" style={styles.link}>Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Signin
