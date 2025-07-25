import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ForgotPassword({ onBackToLogin }) {
  return (
    <div className="flex flex-col items-center space-y-6 px-4 py-6">
      <div className="flex items-center gap-3 mt-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black to-zinc-700 flex items-center justify-center shadow-md">
          <img src="/logo.svg" alt="Logo" className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-black to-zinc-800 bg-clip-text text-transparent">
          Shadcnblocks.com
        </h1>
      </div>

      <div className="w-full space-y-4">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Reset your password
          </DialogTitle>
        </DialogHeader>

        <Input placeholder="Enter your email" type="email" />

        <Button className="w-full bg-black text-white hover:bg-neutral-800">
          Send Reset Link
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Back to{" "}
          <span
            className="font-semibold text-black hover:underline cursor-pointer"
            onClick={onBackToLogin}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
