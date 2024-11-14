import Link from 'next/link';
import { Github, Briefcase } from 'lucide-react';
import { Button } from '@src/components/ui/button';

export default function Navbar() {
    return (
        <nav className="bg-[#e8f5f3] border-b sticky top-0 z-10">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold tracking-wide text-foreground">HEARTH</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link
                            href="https://github.com/triw0lf/HEARTH/blob/main/Forge/Forge.md"
                            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                            Forge
                        </Link>
                        <Link
                            href="https://github.com/triw0lf/HEARTH/blob/main/Kindling/Resources.md"
                            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                            Resources
                        </Link>

                        <Button
                            asChild
                            variant="default"
                            className="flex items-center"
                        >
                            <a
                                href="https://github.com/triw0lf/HEARTH/issues/new/choose"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="mr-2 h-4 w-4" /> Submit Hunt
                            </a>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            className="flex items-center"
                        >
                            <a
                                href="https://www.hackerjobs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Briefcase className="mr-2 h-4 w-4" /> Security Jobs?
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
