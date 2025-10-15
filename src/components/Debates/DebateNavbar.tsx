import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DebateNavbar = ({ title = "Debate Topic", status = "Ongoing" }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background backdrop-blur-sm">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-base font-semibold leading-none">{title}</h2>
          <Badge variant={status === "Ongoing" ? "default" : "secondary"} className="mt-1">
            {status}
          </Badge>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">⏱ 08:15</span>
        <Button variant="outline" size="sm">Export</Button>
        <Button size="sm" variant={"destructive"} className="">
          End Debate
        </Button>
      </div>
    </header>
  );
};

export default DebateNavbar;
