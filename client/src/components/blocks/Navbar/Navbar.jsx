import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Logo } from "@/components/blocks/Navbar/logo";
import { NavMenu } from "@/components/blocks/Navbar/nav-menu";
import { NavigationSheet } from "@/components/blocks/Navbar/navigation-sheet";
import { Login } from "@/components/blocks/AuthBlocks/Login";
import { Signup } from "@/components/blocks/AuthBlocks/Signup";
import { ForgotPassword } from "@/components/blocks/AuthBlocks/ForgotPassword";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [modalView, setModalView] = useState("login");

  const openLogin = () => {
    setModalView("login");
    setOpen(true);
  };

  const openSignup = () => {
    setModalView("signup");
    setOpen(true);
  };

  const openForgot = () => {
    setModalView("forgot");
    setOpen(true);
  };

  return (
    <div className="bg-muted">
      <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full z-50">
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <Logo />
          <NavMenu className="hidden md:block" />
          <div className="flex items-center gap-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex rounded-full"
                  onClick={openLogin}
                >
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button className="rounded-full" onClick={openSignup}>
                  Get Started
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px] rounded-xl">
                {modalView === "login" && (
                  <Login
                    onSwitchToSignup={() => setModalView("signup")}
                    onSwitchToForgot={() => setModalView("forgot")}
                  />
                )}
                {modalView === "signup" && (
                  <Signup onSwitchToLogin={() => setModalView("login")} />
                )}
                {modalView === "forgot" && (
                  <ForgotPassword onBackToLogin={() => setModalView("login")} />
                )}
              </DialogContent>
            </Dialog>
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
