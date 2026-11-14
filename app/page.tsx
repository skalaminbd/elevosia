import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DesignTestPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-12 px-4 py-12 sm:px-6">
      <header className="flex items-center justify-between">
        <span className="font-heading text-xl font-bold">elevosia</span>
        <ThemeToggle />
      </header>

      <section className="space-y-4">
        <h1 className="text-4xl font-bold sm:text-5xl">Make every client count.</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Body text is Inter. The heading above is Geist. Buttons use Inter too.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="highlight">Highlight</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Status badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-success/10 text-success">Paid</Badge>
          <Badge className="bg-warning/10 text-warning">Pending</Badge>
          <Badge className="bg-info/10 text-info">In review</Badge>
          <Badge className="bg-destructive/10 text-destructive">Overdue</Badge>
          <Badge variant="outline">Draft</Badge>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New client</CardTitle>
            <CardDescription>White card on cream background.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <Button className="w-full">Save client</Button>
          </CardContent>
        </Card>

        <Card className="bg-accent">
          <CardHeader>
            <CardTitle>Accent surface</CardTitle>
            <CardDescription>Soft lime tint for highlights.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">INV-2026-0042 · $4,800.00</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
