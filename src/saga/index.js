import { fork, all } from 'redux-saga/effects';

function* rootSagas() {
  yield all([
    // Các sagas đã định nghĩa

    fork(function* () {
      console.log('History saga not implemented yet');
    }),

    fork(function* () {
      console.log('Report saga not implemented yet');
    }),
  ]);
}

export default rootSagas;
