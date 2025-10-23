// FIX: Import React to provide types for SVG components.
import React from 'react';
import type { CommunityPost, Challenge, RunData, LeaderboardUser, CommunityChallenge } from './types';

export const RunnerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M13.5 4.06c0-1.31.94-2.5 2.24-2.82A4.012 4.012 0 0 1 20.5 5c0 1.93-1.38 3.56-3.24 3.9A2.5 2.5 0 0 0 15 8.5v2.09c.74.22 1.5.6 2.08 1.15l1.09-1.09c.1-.1.24-.15.39-.15s.29.05.39.15l1.41 1.41c.2.2.2.51 0 .71l-1.23 1.23c-1.39-1.28-3.08-2.22-4.6-2.61v2.88c1.3.44 2.44 1.29 3.23 2.45.17.25.14.59-.08.8l-1.41 1.41c-.2.2-.51.2-.71 0a4.99 4.99 0 0 1-4.88-4.88V13.5h-1v3.25a2.5 2.5 0 0 0 2.5 2.5h3.04a2.5 2.5 0 0 0 2.5-2.5c0-1.1-.75-2.05-1.75-2.37V13.5A2.5 2.5 0 0 0 13 11V9.5a2.5 2.5 0 0 0-2.5-2.5h-1A2.5 2.5 0 0 0 7 9.5v2.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V9.5a4 4 0 0 1 4-4h1A4 4 0 0 1 15 9.5v.06c.55-.37 1.21-.63 1.9-.75V8.5a4.002 4.002 0 0 1-2.06-7.58C14.19.54 13.5 1.48 13.5 2.5v1.56zM5.5 12c-1.93 0-3.5 1.57-3.5 3.5S3.57 19 5.5 19s3.5-1.57 3.5-3.5S7.43 12 5.5 12zm0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
);

export const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4v-2zm-2 4h8v2H8v-2zm2-8h4v2h-4V7z" />
        <path d="M19.36 8.64A8.94 8.94 0 0 0 12 4c-1.93 0-3.7.6-5.14 1.64l1.42 1.42A6.96 6.96 0 0 1 12 6c3.86 0 7 3.14 7 7 0 1.4-.41 2.7-1.12 3.82l1.42 1.42A8.94 8.94 0 0 0 20 13c0-2.45-1-4.68-2.64-6.36zM6.14 16.36C4.6 14.9 4 12.93 4 11c0-2.45 1-4.68 2.64-6.36L5.22 3.22C3.23 5.2 2 7.95 2 11c0 3.05 1.23 5.8 3.22 7.78l1.42-1.42z" />
        <path d="M16 1H8v2h8V1zm-1.5 14h-5c-.28 0-.5.22-.5.5s.22.5.5.5h5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zm.5-3h-6c-.28 0-.5.22-.5.5s.22.5.5.5h6c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zm0-3h-6c-.28 0-.5.22-.5.5s.22.5.5.5h6c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zM12 4c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
);


export const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-1.4.39-2.72 1.07-3.85l7.11 7.11C10.72 16.39 12 14.6 12 12.5c0-.98-.21-1.9-.58-2.73L4.57 2.92C4.21 3.82 4 4.8 4 5.75v6.5zm15.91-4.18C19.21 5.39 15.82 4 12 4c-1.63 0-3.16.44-4.5.2L12.75 9.45c.8-.45 1.76-.7 2.75-.7 2.21 0 4 1.79 4 4 0 .99-.36 1.89-.95 2.6l4.24 4.24c2.2-2.2 3.12-5.32 2.12-8.47z" />
    </svg>
);

export const BrainIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C9.24 2 7 4.24 7 7c0 2.25 1.34 4.34 3.4 5.25C8.98 12.7 8 13.77 8 15v1c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1c0-1.23-.98-2.3-2.4-2.75C15.66 11.34 17 9.25 17 7c0-2.76-2.24-5-5-5zm-3 5c0-1.65 1.35-3 3-3s3 1.35 3 3c0 1.54-1.15 2.94-2.76 3.18-.32.05-.59.2-.74.45-.15.25-.15.54 0 .79.15.25.42.41.74.45C13.85 11.06 15 9.66 15 8c0-1.1-.9-2-2-2s-2 .9-2 2H9zm9 8.5c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-1c0-.83.67-1.5 1.5-1.5h1.36c.45 0 .85-.29.98-.72.33-1.07 1.25-1.78 2.16-1.78s1.83.71 2.16 1.78c.13.43.53.72.98.72H18c.83 0 1.5.67 1.5 1.5v1z" />
    </svg>
);

export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
);

export const StravaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15.387 17.944l-3.322-6.626H7.933l7.454 14.87L22.84 11.318h-4.132l-3.321 6.626zM8.953 0L5.69 6.516h4.43L8.953 0z" />
    </svg>
);

export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.25c.34 0 .68.02 1.01.07C15.3 2.87 17.13 4.7 17.68 7c.05.33.07.67.07 1.01 0 .34-.02.68-.07 1.01-.55 2.3-2.38 4.13-4.68 4.68-.33.05-.67.07-1.01.07s-.68-.02-1.01-.07C8.69 13.13 6.87 11.3 6.32 9.01 6.27 8.68 6.25 8.34 6.25 8s.02-.68.07-1.01C6.87 4.7 8.69 2.87 11 2.32c.33-.05.67-.07 1.01-.07zM18.5 15.5c.34 0 .68.02 1.01.07 1.75.5 2.98 2.33 2.98 4.43 0 .34-.02.68-.07 1.01-.5 1.75-2.33 2.98-4.43 2.98-.34 0-.68-.02-1.01-.07-1.75-.5-2.98-2.33-2.98-4.43 0-.34.02-.68.07-1.01.5-1.75 2.33-2.98 4.43-2.98zM5.5 13.5c.34 0 .68.02 1.01.07 1.75.5 2.98 2.33 2.98 4.43 0 .34-.02.68-.07 1.01-.5 1.75-2.33 2.98-4.43 2.98-.34 0-.68-.02-1.01-.07-1.75-.5-2.98-2.33-2.98-4.43 0-.34.02-.68.07-1.01.5-1.75 2.33-2.98 4.43-2.98z" />
  </svg>
);


export const MOCK_RUN_HISTORY: RunData[] = [
  { distance: 5.21, time: 1560, avgPace: 299, date: '2024-07-20', elevationGain: 54, source: 'app' },
  { distance: 10.05, time: 3300, avgPace: 328, date: '2024-07-18', elevationGain: 112, source: 'app' },
  { distance: 3.50, time: 980, avgPace: 280, date: '2024-07-16', elevationGain: 23, source: 'app' },
];

export const MOCK_STRAVA_ACTIVITIES = [
    {
        id: '1234567890',
        name: 'Corrida Matinal no Parque',
        distance: 8050, // meters
        moving_time: 2400, // seconds
        total_elevation_gain: 75, // meters
        start_date_local: '2024-07-21T07:00:00Z'
    },
    {
        id: '1234567891',
        name: 'Treino de Intervalos',
        distance: 6200, // meters
        moving_time: 1850, // seconds
        total_elevation_gain: 40, // meters
        start_date_local: '2024-07-19T18:30:00Z'
    }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 1,
    author: 'NeoRunner',
    avatar: 'https://picsum.photos/seed/1/100/100',
    content: 'Just broke my 5k PR! This app is a game changer. The neuro-feedback is insane. #MetaHumano',
    run: { distance: '5.01km', time: '21:34', pace: '4:18/km' },
    likes: 132,
    comments: 18,
  },
  {
    id: 2,
    author: 'TrinityFlow',
    avatar: 'https://picsum.photos/seed/2/100/100',
    content: 'Early morning Synapse Flow run. Feeling connected to every step. The guided audios are pure gold.',
    run: { distance: '7.5km', time: '40:11', pace: '5:21/km' },
    likes: 89,
    comments: 12,
  },
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Novembro Neuronal',
    description: 'Correr 5km todos os dias em Novembro.',
    progress: 15,
    goal: 30,
    unit: 'dias',
    reward: 'Medalha Digital "Persistência"',
  },
  {
    id: 2,
    title: 'Escalada de Elevação',
    description: 'Acumular 1000m de ganho de elevação este mês.',
    progress: 453,
    goal: 1000,
    unit: 'metros',
    reward: '20% OFF na Loja Meta Humana',
  },
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { rank: 1, name: 'Cypher', level: 'MetaHumano', distance: 215.4 },
    { rank: 2, name: 'NeoRunner', level: 'Guardião', distance: 198.2 },
    { rank: 3, name: 'TrinityFlow', level: 'Guardião', distance: 180.7 },
    { rank: 4, name: 'Morpheus Pace', level: 'Guerreiro', distance: 155.1 },
];

export const MOCK_COMMUNITY_CHALLENGES: CommunityChallenge[] = [
  {
    id: 1,
    title: 'Volta à Lua Coletiva',
    description: 'A tribo inteira correndo para alcançar a distância da Terra à Lua!',
    currentProgress: 254800,
    goal: 384400,
    unit: 'km',
    contributors: 1254,
    topContributor: { name: 'Cypher', distance: 215.4 },
  },
  {
    id: 2,
    title: 'Conquista Coletiva',
    description: 'Este desafio já foi batido pela nossa tribo incrível. Um novo começará em breve!',
    currentProgress: 50000,
    goal: 50000,
    unit: 'km',
    contributors: 850,
  },
];
