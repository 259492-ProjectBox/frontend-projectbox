// import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

function AuthLayout({ children }: PropsWithChildren) {
    // redirect("/");

    return <>{children}</>;
}

export default AuthLayout;
