import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Signup({ onSwitchToLogin }) {
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

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
            Create your account
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-2">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatar ?? "/placeholder-avatar.png"} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <Label
              htmlFor="avatar"
              className="block text-center w-full bg-muted text-sm py-2 rounded-lg hover:bg-muted-foreground/10 cursor-pointer"
            >
              Upload Avatar
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <Input placeholder="Full Name" type="text" />
        <Input placeholder="Email" type="email" />
        <Input placeholder="Phone Number" type="tel" />
        <Input placeholder="Address" type="text" />
        <Input placeholder="Password" type="password" />
        <Input placeholder="Confirm Password" type="password" />

        <Button className="w-full bg-black text-white hover:bg-neutral-800">
          Create Account
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already a user?{" "}
          <span
            className="font-semibold text-black hover:underline cursor-pointer"
            onClick={onSwitchToLogin}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
