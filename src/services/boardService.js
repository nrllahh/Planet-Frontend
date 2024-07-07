import boardApi from "../api/boardApi";
import {
  setCurrentBoard,
  setUserBoards,
  createBoardList,
  editList,
  changeListTitle,
  changeListOrder,
} from "../data/boardSlice";
import { pushNotification } from "../data/notificationSlice";
import { store } from "../data/store";

export async function getUserBoards(params = { pageSize: 8, currentPage: 1 }) {
  const response = await boardApi.getUserBoards(params);

  if (!response.isSuccess) {
    return;
  }

  store.dispatch(setUserBoards(response.body.items));

  return response;
}

export async function getCurrentBoard(id) {
  const response = await boardApi.getCurrentBoard(id);

  if (response.isSuccess) {
    store.dispatch(setCurrentBoard(response.body));
  }

  return response;
}

export async function addList(boardId) {
  const order =
    (store.getState().board.currentBoard.lists.reverse()[0]?.order ?? 1) + 1024;
  const response = await boardApi.createBoardList("Yeni Liste", boardId, order);
  if (response.isSuccess) {
    const payload = {
      id: response.body.listId,
      title: "Yeni Liste",
      boardId: boardId,
      order: order,
    };
    store.dispatch(createBoardList(payload));
  }

  return response;
}

export async function createBoard(title, description) {
  const response = await boardApi.createBoard(title, description);

  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        severity: "success",
        content: response.message,
        duration: 3000,
      })
    );
  } else {
    store.dispatch(
      pushNotification({
        severity: "error",
        content: response.message,
        duration: 3000,
      })
    );
  }

  return response;
}

export async function editBoardList(body) {
  body.boardId = store.getState().board.currentBoard.id;
  const lists = store.getState().board.currentBoard.lists;

  if (body.isLeft !== null) {
    const prevIndex =
      Array.from(lists).indexOf(lists.find((l) => l.id === body.listId)) - 1;
    const nextIndex =
      Array.from(lists).indexOf(lists.find((l) => l.id === body.listId)) + 1;

    if (body.isLeft) {
      body.order = prevIndex >= 0 ? lists[prevIndex].order - 1 : body.order;
    } else {
      body.order =
        nextIndex < lists.length ? lists[nextIndex].order + 1 : body.order;
    }
  }

  const response = await boardApi.editList(body);
  const { listId, title, order } = body;

  if (response.isSuccess) {
    store.dispatch(
      editList({
        listId,
        title,
        order,
      })
    );
  }

  return response;
}

export async function inviteMember(boardId) {
  const response = await boardApi.inviteMember(boardId);

  if (response.isSuccess) {
    const baseUrl = import.meta.env.VITE_APP_URL;
    const key = response.body.key;
    const invitationUrl = `${baseUrl}/Invitation/${key}`;

    const element = document.createElement("input");
    element.value = invitationUrl;

    element.select();
    element.setSelectionRange(0, 9999);

    navigator.clipboard.writeText(element.value);

    store.dispatch(
      pushNotification({
        severity: "success",
        content: response.message,
        duration: 3000,
      })
    );
  }
}

export async function acceptInvitation(key) {
  const response = await boardApi.acceptInvitation(key);

  return response;
}

export async function handleBoardListTitleChangedEvent(notification) {
  store.dispatch(
    changeListTitle({
      id: notification.listId,
      title: notification.title,
    })
  );
}

export async function handleBoardListOrderChangedEvent(notification) {
  store.dispatch(
    changeListOrder({
      id: notification.listId,
      title: notification.order,
    })
  );
}
