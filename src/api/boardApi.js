import api from "./api";

const boardApi = {
  getUserBoards: async (params = { pageSize: 10, currentPage: 1 }) =>
    await api.get("Boards/UserBoards", params),
  getCurrentBoard: async (id) => await api.get(`Boards/${id}`),
  createBoardList: async (title, boardId, order) =>
    await api.post("Boards/Lists/Add", { title, boardId, order }),
  createBoard: async (title, description) => await api.post("Boards/Create", {title, description}),
  editList: async (body) =>  await api.post("Boards/Lists/Edit", body),
  inviteMember: async (boardId) => await api.post("Boards/Members/Invite", {boardId}),
  acceptInvitation: async(key) => await api.get(`/Boards/Members/Invitation/${key}`)
};

export default boardApi;
