import type { User } from "./types"

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("mahzskin_user")
  return userStr ? JSON.parse(userStr) : null
}

export function saveUser(user: User): void {
  localStorage.setItem("mahzskin_user", JSON.stringify(user))
}

export function removeUser(): void {
  localStorage.removeItem("mahzskin_user")
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}

export function login(email: string, password: string): { success: boolean; error?: string; user?: User } {
  // Simple validation for demo purposes
  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  // Check if user exists in localStorage
  const usersStr = localStorage.getItem("mahzskin_users")
  const users: User[] = usersStr ? JSON.parse(usersStr) : []

  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  saveUser(user)
  return { success: true, user }
}

export function signup(
  name: string,
  email: string,
  password: string,
): { success: boolean; error?: string; user?: User } {
  // Simple validation
  if (!name || !email || !password) {
    return { success: false, error: "All fields are required" }
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  // Check if user already exists
  const usersStr = localStorage.getItem("mahzskin_users")
  const users: User[] = usersStr ? JSON.parse(usersStr) : []

  if (users.find((u) => u.email === email)) {
    return { success: false, error: "Email already registered" }
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
  }

  users.push(newUser)
  localStorage.setItem("mahzskin_users", JSON.stringify(users))
  saveUser(newUser)

  return { success: true, user: newUser }
}

export function logout(): void {
  removeUser()
}
