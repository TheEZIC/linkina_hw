import React from 'react';

const ManagerHeader = () => {
  return (
    <tr>
      <th>#</th>
      <th>Название</th>
      <th>Срок</th>
      <th>Статус</th>
      <th style={{ width: "150px" }}></th>
    </tr>
  );
};

export default ManagerHeader;
