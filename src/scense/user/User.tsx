import React from "react";

import { columns } from "../../components/table/users/columns";
import { DataTable } from "../../components/global/data-table";

function User() {
  const users = [
    {
      id: 1,
      firstName: "sann",
      lastName: "kim",
      age: 32,
    },
    {
      id: 2,
      firstName: "poe",
      lastName: "jack",
      age: 31,
    },
  ];
  return (
    <div>
      <DataTable columns={columns} data={users} />
    </div>
  );
}

export default User;
