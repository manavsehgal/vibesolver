CREATE TABLE `analysis_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`solution_id` text,
	`criteria` text NOT NULL,
	`results` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`solution_id`) REFERENCES `solutions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `flashcards` (
	`id` text PRIMARY KEY NOT NULL,
	`solution_id` text,
	`front` text NOT NULL,
	`back` text NOT NULL,
	`category` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`solution_id`) REFERENCES `solutions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `solutions` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`aws_services` text NOT NULL,
	`architecture` text,
	`requirements` text NOT NULL,
	`cost_estimate` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
