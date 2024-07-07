import cardApi from "../api/cardApi";
import { pushNotification } from "../data/notificationSlice";
import {
  setCurrentCard,
  setListCards,
  moveCardBackward,
  moveCardForward,
  changeLabel,
  createListCard,
  changeCardTitle,
} from "../data/cardSlice";
import { store } from "../data/store";

export async function createCard(listId) {
  const order =
    (store
      .getState()
      .card.listCards.filter((c) => c.listId === listId)
      .reverse()[0]?.order ?? 0) + 1024;
  const response = await cardApi.createCard(
    listId,
    "Yeni oluşturulmuş kart",
    order
  );

  if (response.isSuccess) {
    const payload = {
      id: response.body.cardId,
      title: "Yeni oluşturulmuş kart",
      listId: listId,
      order: order,
      user: null,
      fullName: null,
      labels: [],
    };

    store.dispatch(createListCard(payload));
  }

  return response;
}

export async function getListCards(listIds) {
  const promises = listIds.map((listId) =>
    cardApi.getListCards({
      pageSize: 30,
      currentPage: 1,
      listId: listId,
    })
  );

  const responses = await Promise.all(promises);
  if (responses.every((r) => r.isSuccess)) {
    store.dispatch(setListCards(responses.flatMap((r) => r.body.items)));
  }

  return responses[0];
}

export async function getCardInfo(id) {
  const response = await cardApi.getCardInfo(id);
  if (response.isSuccess) {
    store.dispatch(setCurrentCard(response.body));
  }
  return response;
}

export async function editCardTitle(params) {
  const response = await cardApi.editCardTitle({
    cardId: params.cardId,
    title: params.title,
  });
  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  else {
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

export async function editCardDesc(params) {
  const response = await cardApi.editCardDesc({
    cardId: params.cardId,
    description: params.description,
  });
  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  else {
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

export async function moveCard(moveArgs) {
  store.dispatch(moveCardForward(moveArgs));

  const response = await cardApi.moveCard({
    cardId: moveArgs.cardId,
    newListId: moveArgs.newListId,
    newOrder: moveArgs.newOrder,
  });

  if (!response.isSuccess) {
    store.dispatch(moveCardBackward(moveArgs));
  }
  

  return response;
}
export async function addLabelToCard(cardId, boardLabelId) {
  const response = await cardApi.addLabelToCard(cardId, boardLabelId);
  const boardLabel = store
    .getState()
    .board.currentBoard.labels.find((l) => l.id === boardLabelId);

  if (response.isSuccess) {
    debugger;
    store.dispatch(
      changeLabel({
        cardId: cardId,
        boardLabel: boardLabel,
        isAdded: true,
      })
    );
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  else {
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

export async function removeLabelFromCard(cardId, boardLabelId) {
  const response = await cardApi.removeLabelFromCard(cardId, boardLabelId);
  const boardLabel = store
    .getState()
    .board.currentBoard.labels.find((l) => l.id === boardLabelId);

  if (response.isSuccess) {
    store.dispatch(
      changeLabel({
        cardId: cardId,
        boardLabel: boardLabel,
        isAdded: false,
      })
    );
  }
  else {
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

export async function editCheckListItem(params) {
  const response = await cardApi.editCheckListItem({
    cardId: params.cardId,
    checkListId: params.checkListId,
    checkListItemId: params.checkListItemId,
    isChecked: params.isChecked,
    content: params.content,
  });
  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  else {
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

export async function addCheckListItem(params) {
  const response = await cardApi.addCheckListItem({
    cardId: params.cardId,
    checkListId: params.checkListId,
    content: params.content,
  });
  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  else {
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

export async function addCheckList(params) {
  const response = await cardApi.addCheckList({
    cardId: params.cardId,
    title: params.title,
  });
  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  else {
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

export async function editCheckListTitle(params) {
  const response = await cardApi.editCheckListTitle({
    cardId: params.cardId,
    checkListId: params.checkListId,
    newTitle: params.newTitle,
  });
  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  else {
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

export async function removeCheckList(params) {
  const response = await cardApi.removeCheckList({
    cardId: params.cardId,
    checkListId: params.checkListId,
  });
  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  else {
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

export async function removeCheckListItem(params) {
  const response = await cardApi.removeCheckListItem({
    cardId: params.cardId,
    checkListId: params.checkListId,
    checkListItemId: params.checkListItemId,
  });
  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  return response;
}

export async function addComment(params) {
  const response = await cardApi.addComment({
    cardId: params.cardId,
    comment: params.comment,
  });
  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  else {
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

export async function editCardDate(params) {
  const response = await cardApi.editCardDate({
    cardId: params.cardId,
    startDate: params.startDate === undefined ? null : params.startDate,
    endDate: params.endDate === undefined ? null : params.endDate,
  });
  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  else {
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

export async function handleCardMovedEvent(notification) {
  store.dispatch(
    moveCardForward({
      newListId: notification.newListId,
      newOrder: notification.newOrder,
      cardId: notification.cardId,
    })
  );
}

export async function deleteCard(cardId) {
  const response = await cardApi.deleteCard(cardId);
  if (response.isSuccess) {
    store.dispatch(
      pushNotification({
        content: response.message,
        duration: 5000,
        severity: "success",
      })
    );
  }
  else {
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

export function handleCardTitleChangedEvent(notification) {
  store.dispatch(changeCardTitle({
    id: notification.id,
    title: notification.title
  }));
}
