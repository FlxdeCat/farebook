import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { VALIDATE_JWT } from "../query/validateUserJWT";

export function useUserLogOutCheck() {
  const user = localStorage.getItem("user")
  const { data } = useQuery(VALIDATE_JWT, {
    variables: {
      "jwt": user
    }
  })
  const nav = useNavigate()

  useEffect(() => {
    if (!user || user == "") {
      localStorage.clear()
      nav("/")
    }
    else {
      if (data) {
        if (!data.validateUserJWT) {
          localStorage.clear()
          nav("/")
        }
      }
    }
  }, [nav, data, user]);
}

export function useUserLogInCheck() {
  const { data } = useQuery(VALIDATE_JWT, {
    variables: {
      "jwt": localStorage.getItem("user")
    }
  })
  const nav = useNavigate()

  useEffect(() => {
    if (data) {
      if (data.validateUserJWT) {
        nav("/home")
      }
      else {
        localStorage.clear()
        nav("/")
      }
    }
  }, [nav, data]);
}