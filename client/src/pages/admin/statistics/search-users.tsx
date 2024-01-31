import { useEffect, useState } from "react";
import axios from "@/app/utils/axios";
import { Formik, Form, Field } from "formik";
import { SearchUsersProps } from "@/app/types/propsTypes";
import { User } from "@/app/types/userTypes";
import { FaSearch } from "react-icons/fa";


export const SearchUsers = ({ setActiveUser, setShowStats }: SearchUsersProps) => {
  const [ users, setUsers ] = useState<User[] | null>(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await axios.get("/users");
      setUsers(response.data);
    }

    fetchAllUsers();
  }, []);

  return (
    <div className="search-user-form">
      <Formik
        initialValues={{ searchQuery: ""}}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await axios.get(`/users?searchby=${values.searchQuery}`);
            setUsers(response.data);
            setSubmitting(false);
          } catch (error: any) {
            alert(error.response.data);
          }
        }}
      >
        {() => (
          <Form>
            <Field type="text" name="searchQuery" placeholder="Enter user's name, surname or nickname" />
            <button type="submit"><FaSearch /></button>
          </Form>
        )}
      </Formik>
      <div className="user-choice">
        <ul>
          {users?.map(user => (
            <li key={user.nickname} className="user">
              <div className="user-data">
                <b>{user.name} {user.surname}</b>
                <p>{user.nickname}</p>
              </div>
              <button type="button" onClick={() => {
                setActiveUser(user);
                setShowStats(true);
              }}>Show</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}