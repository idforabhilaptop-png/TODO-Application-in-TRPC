import { useState } from "react"
import { useTRPC } from "../../utils/trpc"
import { useMutation, useQuery } from "@tanstack/react-query"

interface Todo {
    _id: string
    title: string
    description: string
}


const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f7f7f5",
        fontFamily: "'Georgia', serif",
        display: "flex",
        justifyContent: "center",
        paddingTop: "60px",
        paddingBottom: "60px",
    },
    container: {
        width: "100%",
        maxWidth: "560px",
        padding: "0 20px",
    },
    heading: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#1a1a1a",
        letterSpacing: "-0.5px",
        marginBottom: "6px",
    },
    subtext: {
        fontSize: "13px",
        color: "#999",
        marginBottom: "36px",
    },
    emptyText: {
        fontSize: "14px",
        color: "#aaa",
        padding: "40px 0",
        textAlign: "center" as const,
        borderTop: "1px solid #e8e8e4",
    },
    todoCard: {
        backgroundColor: "#fff",
        border: "1px solid #e8e8e4",
        borderRadius: "10px",
        padding: "18px 20px",
        marginBottom: "12px",
    },
    todoHeader: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
    },
    checkbox: {
        marginTop: "3px",
        width: "16px",
        height: "16px",
        accentColor: "#1a1a1a",
        cursor: "pointer",
        flexShrink: 0,
    },
    todoBody: {
        flex: 1,
    },
    todoTitle: {
        fontSize: "15px",
        fontWeight: "600",
        color: "#1a1a1a",
        margin: "0 0 4px 0",
    },
    todoDescription: {
        fontSize: "13px",
        color: "#777",
        margin: "0",
        lineHeight: "1.5",
    },
    todoActions: {
        display: "flex",
        gap: "8px",
        marginLeft: "auto",
        flexShrink: 0,
    },
    btnGhost: {
        fontSize: "12px",
        padding: "5px 12px",
        borderRadius: "6px",
        border: "1px solid #e0e0db",
        backgroundColor: "transparent",
        color: "#555",
        cursor: "pointer",
    },
    btnDanger: {
        fontSize: "12px",
        padding: "5px 12px",
        borderRadius: "6px",
        border: "1px solid #ffd5d5",
        backgroundColor: "#fff5f5",
        color: "#c0392b",
        cursor: "pointer",
    },
    formCard: {
        backgroundColor: "#fff",
        border: "1px solid #e8e8e4",
        borderRadius: "10px",
        padding: "20px",
        marginTop: "8px",
    },
    formLabel: {
        display: "block",
        fontSize: "11px",
        fontWeight: "600",
        color: "#999",
        letterSpacing: "0.8px",
        textTransform: "uppercase" as const,
        marginBottom: "6px",
    },
    formInput: {
        width: "100%",
        fontSize: "14px",
        color: "#1a1a1a",
        border: "1px solid #e8e8e4",
        borderRadius: "7px",
        padding: "9px 12px",
        outline: "none",
        boxSizing: "border-box" as const,
        fontFamily: "inherit",
        backgroundColor: "#fafaf8",
    },
    formTextarea: {
        width: "100%",
        fontSize: "14px",
        color: "#1a1a1a",
        border: "1px solid #e8e8e4",
        borderRadius: "7px",
        padding: "9px 12px",
        outline: "none",
        boxSizing: "border-box" as const,
        fontFamily: "inherit",
        backgroundColor: "#fafaf8",
        resize: "vertical" as const,
        minHeight: "100px",
    },
    formRow: {
        marginBottom: "14px",
    },
    formActions: {
        display: "flex",
        gap: "8px",
        justifyContent: "flex-end",
        marginTop: "16px",
    },
    btnPrimary: {
        fontSize: "13px",
        padding: "8px 20px",
        borderRadius: "7px",
        border: "none",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    btnSecondary: {
        fontSize: "13px",
        padding: "8px 16px",
        borderRadius: "7px",
        border: "1px solid #e0e0db",
        backgroundColor: "transparent",
        color: "#777",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    addButton: {
        width: "100%",
        marginTop: "16px",
        padding: "11px",
        fontSize: "13px",
        borderRadius: "8px",
        border: "1.5px dashed #d0d0ca",
        backgroundColor: "transparent",
        color: "#888",
        cursor: "pointer",
        fontFamily: "inherit",
        letterSpacing: "0.3px",
    },
    divider: {
        border: "none",
        borderTop: "1px solid #e8e8e4",
        margin: "0 0 16px 0",
    },
}


interface TodoFormProps {
    initialTitle?: string
    initialDescription?: string
    onSave: (title: string, description: string) => void
    onCancel: () => void
    isPending: boolean
    saveLabel: string
    pendingLabel: string
}

const TodoForm = ({
    initialTitle = "",
    initialDescription = "",
    onSave,
    onCancel,
    isPending,
    saveLabel,
    pendingLabel,
}: TodoFormProps) => {
    const [title, setTitle] = useState(initialTitle)
    const [description, setDescription] = useState(initialDescription)

    return (
        <div style={styles.formCard}>
            <div style={styles.formRow}>
                <label style={styles.formLabel}>Title</label>
                <input
                    style={styles.formInput}
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div style={styles.formRow}>
                <label style={styles.formLabel}>Description</label>
                <textarea
                    style={styles.formTextarea}
                    placeholder="Add some details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div style={styles.formActions}>
                <button style={styles.btnSecondary} onClick={onCancel}>
                    Cancel
                </button>
                <button
                    style={{ ...styles.btnPrimary, opacity: isPending ? 0.6 : 1 }}
                    onClick={() => onSave(title, description)}
                    disabled={isPending}
                >
                    {isPending ? pendingLabel : saveLabel}
                </button>
            </div>
        </div>
    )
}

// ─── AddTodo ──────────────────────────────────────────────────────────────────

interface AddTodoProps {
    onSaveSuccess: () => void
    onCancel: () => void
}

const AddTodo = ({ onSaveSuccess, onCancel }: AddTodoProps) => {
    const trpc = useTRPC()
    const mutation = useMutation(
        trpc.todo.todoCreate.mutationOptions({
            onSuccess: () => { onSaveSuccess(); onCancel() },
            onError: (e) => alert(e?.message),
        })
    )

    return (
        <TodoForm
            onSave={(title, description) => mutation.mutate({ title, description })}
            onCancel={onCancel}
            isPending={mutation.isPending}
            saveLabel="Add Todo"
            pendingLabel="Saving..."
        />
    )
}

// ─── UpdateTodo ───────────────────────────────────────────────────────────────

interface UpdateTodoProps {
    todo: Todo
    onSaveSuccess: () => void
    onCancel: () => void
}

const UpdateTodo = ({ todo, onSaveSuccess, onCancel }: UpdateTodoProps) => {
    const trpc = useTRPC()
    const mutation = useMutation(
        trpc.todo.todoUpdate.mutationOptions({
            onSuccess: () => { onSaveSuccess(); onCancel() },
            onError: (e) => alert(e?.message),
        })
    )

    return (
        <TodoForm
            initialTitle={todo.title}
            initialDescription={todo.description}
            onSave={(title, description) =>
                mutation.mutate({ id: todo._id, title, description })
            }
            onCancel={onCancel}
            isPending={mutation.isPending}
            saveLabel="Save Changes"
            pendingLabel="Updating..."
        />
    )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
    const [addTodo, setAddTodo] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const trpc = useTRPC()
    const todoQuery = useQuery(trpc.todo.todoGetAll.queryOptions())
    const todos: Todo[] = todoQuery.data?.todos ?? []

    const deleteMutation = useMutation(
        trpc.todo.todoDelete.mutationOptions({
            onSuccess: () => todoQuery.refetch(),
            onError: (e) => alert(e?.message),
        })
    )

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.heading}>My Todos</h1>
                <p style={styles.subtext}>
                    {todos.length} {todos.length === 1 ? "task" : "tasks"} total
                </p>

                {todoQuery.isLoading && (
                    <p style={{ ...styles.emptyText }}>Loading...</p>
                )}

                {!todoQuery.isLoading && todos.length === 0 && (
                    <p style={styles.emptyText}>No todos yet. Add one below.</p>
                )}

                {todos.map((todo) => (
                    <div key={todo._id} style={styles.todoCard}>
                        <div style={styles.todoHeader}>
                            <input type="checkbox" style={styles.checkbox} />
                            <div style={styles.todoBody}>
                                <p style={styles.todoTitle}>{todo.title}</p>
                                <p style={styles.todoDescription}>{todo.description}</p>
                            </div>
                            <div style={styles.todoActions}>
                                <button
                                    style={styles.btnGhost}
                                    onClick={() =>
                                        setEditingId(editingId === todo._id ? null : todo._id)
                                    }
                                >
                                    {editingId === todo._id ? "Close" : "Edit"}
                                </button>
                                <button
                                    style={styles.btnDanger}
                                    onClick={() => deleteMutation.mutate({ id: todo._id })}
                                    disabled={deleteMutation.isPending}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {editingId === todo._id && (
                            <div style={{ marginTop: "14px" }}>
                                <hr style={styles.divider} />
                                <UpdateTodo
                                    todo={todo}
                                    onSaveSuccess={todoQuery.refetch}
                                    onCancel={() => setEditingId(null)}
                                />
                            </div>
                        )}
                    </div>
                ))}

                {addTodo && (
                    <AddTodo
                        onSaveSuccess={todoQuery.refetch}
                        onCancel={() => setAddTodo(false)}
                    />
                )}

                {!addTodo && (
                    <button style={styles.addButton} onClick={() => setAddTodo(true)}>
                        + Add a new todo
                    </button>
                )}
            </div>
        </div>
    )
}

export default Dashboard