//  ===== Выход из личного кабинета =========

const logOut = new LogoutButton();
logOut.action = () => {
  ApiConnector.logout((response) => {
    if (response.success === true) {
      location.reload();
    }
  });
};

// === Получение информации о пользователе ====

ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

// ===== Получение текущих курсов валюты =======

const ratesBoard = new RatesBoard();
function ratesUpdate() {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
}
ratesUpdate();
setInterval(ratesUpdate, 60000);

// =========== Операции с деньгами =============

// ========= Пополнение баланса   ==============

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (replenBalance) =>
  ApiConnector.addMoney(replenBalance, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(
        true,
        "Успешное пополнение счета на " +
          replenBalance.amount +
          " " +
          replenBalance.currency
      );
    }
    moneyManager.setMessage(false, response.error);
  });

// =================== Конвертация валют ================
moneyManager.conversionMoneyCallback = (convertationCurrencyMoney) => {
  ApiConnector.convertMoney(convertationCurrencyMoney, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(
        true,
        "Успешная конвертация суммы " +
          convertationCurrencyMoney.fromAmount +
          " " +
          convertationCurrencyMoney.fromCurrency
      );
    }
    moneyManager.setMessage(false, response.error);
  });
};

// ================== Перевод валюты =====================

moneyManager.sendMoneyCallback = (transferMoneyToUser) => {
  ApiConnector.transferMoney(transferMoneyToUser, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(
        true,
        "Успешный перевод " +
          transferMoneyToUser.amount +
          " " +
          transferMoneyToUser.currency +
          " получателю " +
          transferMoneyToUser.to
      );
    }
    moneyManager.setMessage(false, response.error);
  });
};

// ============= Работа с избранным ==================

const favoriteWidgets = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
  if (response.success) {
    favoriteWidgets.clearTable();
    favoriteWidgets.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

// ==== Добавление пользователя в список избранных ====

favoriteWidgets.addUserCallback = (userInfo) => {
  ApiConnector.addUserToFavorites(userInfo, (response) => {
    if (response.success) {
      favoriteWidgets.clearTable();
      favoriteWidgets.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      return favoriteWidgets.setMessage(
        true,
        "Успешно добавлен новый пользователь: " + userInfo.name
      );
    }
    return favoriteWidgets.setMessage(false, response.error);
  });
};

// ======== Удаление пользователя из избранного =======
favoriteWidgets.removeUserCallback = (id) => {
  ApiConnector.removeUserFromFavorites(id, (response) => {
    if (response.success) {
      favoriteWidgets.clearTable();
      favoriteWidgets.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      return favoriteWidgets.setMessage(true, "Пользователь успешно удален");
    }
    return favoriteWidgets.setMessage(false, response.error);
  });
};
