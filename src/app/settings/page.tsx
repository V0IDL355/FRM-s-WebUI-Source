"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Settings_API from "@/app/settings/settings pages/api";

const version = "1.0.0";
export default function Settings() {
  return (
    <div style={{ margin: 5, padding: 25 }}>
      <Card>
        <CardHeader>
          <CardTitle>Web UI Version : {version}</CardTitle>
          <CardDescription>Web UI settings</CardDescription>
        </CardHeader>
        <CardContent style={{ margin: 5 }}>
          <Settings_API />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Made By VOID</p>
        </CardFooter>
      </Card>
    </div>
  );
}
