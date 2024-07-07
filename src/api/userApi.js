import api from "./api";

const userApi = {
    signIn: async (email, password) => await api.post("Users/SignIn", {email,password}),
    signUp: async (firstName, lastName, email, password, passwordConfirmation) => await api.post("Users/SignUp", 
    {firstName, lastName, email, password, passwordConfirmation}
    ),
    changePassword: async (body) => await api.post("Users/ChangePassword", body),
    getStatistics: async () => await api.get("Users/GetUserStatistics")
}

export default userApi;