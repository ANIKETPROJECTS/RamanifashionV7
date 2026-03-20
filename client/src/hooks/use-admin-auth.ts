import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export function useAdminAuth() {
  const [, setLocation] = useLocation();

  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["/api/admin/verify"],
    retry: false,
    enabled: !!localStorage.getItem("adminToken"),
  });

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    
    if (!adminToken) {
      setLocation("/admin/login");
      return;
    }

    if (error || (authData && !authData.valid)) {
      localStorage.removeItem("adminToken");
      setLocation("/admin/login");
    }
  }, [authData, error, setLocation]);

  return { isLoading, isAuthenticated: !!authData?.valid };
}
