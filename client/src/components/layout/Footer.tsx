import React from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Instagram, 
  Facebook, 
  MessagesSquare
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-surfaceLight mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-header font-bold mb-4">Vinylbox</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/about">
                  <a className="hover:text-primary">About</a>
                </Link>
              </li>
              <li>
                <Link href="/jobs">
                  <a className="hover:text-primary">Jobs</a>
                </Link>
              </li>
              <li>
                <Link href="/news">
                  <a className="hover:text-primary">News</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-primary">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-header font-bold mb-4">Community</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/guidelines">
                  <a className="hover:text-primary">Guidelines</a>
                </Link>
              </li>
              <li>
                <Link href="/members">
                  <a className="hover:text-primary">Members</a>
                </Link>
              </li>
              <li>
                <Link href="/leaderboards">
                  <a className="hover:text-primary">Leaderboards</a>
                </Link>
              </li>
              <li>
                <Link href="/discord">
                  <a className="hover:text-primary">Discord</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-header font-bold mb-4">Help</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/faq">
                  <a className="hover:text-primary">FAQ</a>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <a className="hover:text-primary">Support</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="hover:text-primary">Terms of Use</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="hover:text-primary">Privacy Policy</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-header font-bold mb-4">Connect</h3>
            <div className="flex space-x-4 text-muted-foreground mb-4">
              <a href="#" className="hover:text-primary text-xl">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary text-xl">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary text-xl">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary text-xl">
                <MessagesSquare size={20} />
              </a>
            </div>
            <p className="text-muted-foreground text-sm">Subscribe to our newsletter</p>
            <div className="mt-2 flex">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-surfaceLight text-white rounded-r-none focus:ring-primary"
              />
              <Button className="rounded-l-none">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-surfaceLight mt-8 pt-6 text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Vinylbox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
