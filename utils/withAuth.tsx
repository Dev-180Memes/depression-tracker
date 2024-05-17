/* eslint-disable react/display-name */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { verifyToken } from "./auth";

const withAuth = (WrappedComponent: React.FC) => {
    return (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/");
                return;
            }

            const fetchUser = async () => {
                try {
                    const user = await verifyToken(token);
                    if (!user) {
                        console.error("Invalid token");
                        router.push("/");
                    }
                } catch (error) {
                    console.error("Failed to verify token", error);
                    router.push("/");
                }
            };

            fetchUser();
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;