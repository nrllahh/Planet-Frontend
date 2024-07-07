import { deleteCard } from "../services/cardService";
import api from "./api";

const cardApi = {
  getListCards: async (params) => await api.get("Cards/GetListCards", params),
  getCardInfo: async (id) => await api.get(`Cards/${id}`),
  editCardTitle: async (params) => await api.post("Cards/EditTitle", params),
  editCardDesc: async (params) =>
    await api.post("Cards/EditDescriptiion", params),
  moveCard: async (body) => await api.post("Cards/MoveCard", body),
  addLabelToCard: async (cardId, boardLabelId) =>
    await api.post("Cards/Labels/Add", { cardId, boardLabelId }),
  removeLabelFromCard: async (cardId, boardLabelId) =>
    await api.post("Cards/Labels/Remove", { cardId, boardLabelId }),
  createCard: async (listId, title, order) =>
    await api.post("Cards/Create", { listId, title, order }),
  editCheckListItem: async (params) =>
    await api.post("Cards/CheckLists/Items/Edit", params),
  addCheckListItem: async (params) =>
    await api.post("Cards/CheckLists/Items/Add", params),
  addCheckList: async (params) =>
    await api.post("Cards/CheckLists/Add", params),
  editCheckListTitle: async (params) =>
    await api.post("Cards/CheckLists/Edit", params),
  removeCheckList: async (params) =>
    await api.post("Cards/CheckLists/Remove", params),
  removeCheckListItem: async (params) =>
    await api.post("Cards/CheckLists/Items/Remove", params),
  addComment: async (params) => await api.post("Cards/Comments/Add", params),
  editCardDate: async (params) => await api.post("Cards/EditCardDate", params),
  deleteCard: async (id) => await api.post("Cards/RemoveCard", { id }),
};

export default cardApi;
