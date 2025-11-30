<?php

namespace Database\Seeders;

use App\Models\Channel;
use Illuminate\Database\Seeder;

class ChannelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $channels = [
            [
                'name' => 'announcements',
                'display_name' => 'Announcements',
                'description' => 'Official announcements from the Glenride team.',
                'visibility' => 'members',
                'is_read_only' => true,
            ],
            [
                'name' => 'introductions',
                'display_name' => 'Introductions',
                'description' => 'Introduce yourself to the Glenride community.',
                'visibility' => 'members',
                'is_read_only' => false,
            ],
            [
                'name' => 'ethics-labs',
                'display_name' => 'Ethics Labs',
                'description' => 'Discussions around ethics, responsibility, and values.',
                'visibility' => 'members',
                'is_read_only' => false,
            ],
            [
                'name' => 'critique-studies',
                'display_name' => 'Critique Studies',
                'description' => 'Analysis and unmasking of systems and structures.',
                'visibility' => 'members',
                'is_read_only' => false,
            ],
            [
                'name' => 'praxis-builds',
                'display_name' => 'Praxis Builds',
                'description' => 'Practical projects and tools for change.',
                'visibility' => 'members',
                'is_read_only' => false,
            ],
            [
                'name' => 'resources',
                'display_name' => 'Resources',
                'description' => 'Share helpful resources, tools, and readings.',
                'visibility' => 'members',
                'is_read_only' => false,
            ],
            [
                'name' => 'collab-requests',
                'display_name' => 'Collaboration Requests',
                'description' => 'Find collaborators and team up on projects.',
                'visibility' => 'members',
                'is_read_only' => false,
            ],
        ];

        foreach ($channels as $channel) {
            Channel::firstOrCreate(
                ['name' => $channel['name'], 'program_id' => null],
                $channel
            );
        }
    }
}
