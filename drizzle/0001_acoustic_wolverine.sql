CREATE TABLE `export_history` (
	`id` text PRIMARY KEY NOT NULL,
	`solution_id` text,
	`export_type` text NOT NULL,
	`filename` text NOT NULL,
	`settings` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`solution_id`) REFERENCES `solutions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text DEFAULT '#3B82F6',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `solution_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`solution_id` text,
	`project_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`solution_id`) REFERENCES `solutions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#6B7280',
	`usage_count` integer DEFAULT 0,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `solutions` ADD `recommendations` text;--> statement-breakpoint
ALTER TABLE `solutions` ADD `tags` text;--> statement-breakpoint
ALTER TABLE `solutions` ADD `status` text DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `solutions` ADD `version` integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE `solutions` ADD `parent_id` text;--> statement-breakpoint
ALTER TABLE `solutions` ADD `is_template` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `solutions` ADD `is_favorite` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `solutions` ADD `last_accessed_at` integer;