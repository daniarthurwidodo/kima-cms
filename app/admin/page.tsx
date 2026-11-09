import { logoutAction } from "@/features/simple-auth/simple-auth.actions";

const iconPaths = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 8.94 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.52-1.03H3v-4h.08A1.7 1.7 0 0 0 4.6 8.94a1.7 1.7 0 0 0-.34-1.88L4.2 7l2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.03-1.52V3h4v.08A1.7 1.7 0 0 0 15.06 4.6a1.7 1.7 0 0 0 1.88-.34L17 4.2 19.8 7l-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.52 1.03H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  arrowUp: <path d="m18 15-6-6-6 6" />,
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  trending: <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
};

type IconName = keyof typeof iconPaths;
type NavigationItem = { label: string; icon: IconName; active?: boolean; count?: number };

const workspaceNavigation: NavigationItem[] = [
  { label: "Overview", icon: "dashboard", active: true },
  { label: "Content", icon: "file", count: 12 },
  { label: "Media library", icon: "image" },
];
const manageNavigation: NavigationItem[] = [
  { label: "Users", icon: "users" },
  { label: "Comments", icon: "message", count: 8 },
  { label: "Settings", icon: "settings" },
];
const metrics = [
  { label: "Total content", value: "1,284", change: "12.5%", note: "vs. last month", icon: "file", color: "bg-violet-50 text-violet-600", sparkline: "M2 27C14 26 15 18 27 20S43 25 51 15 69 17 78 9 91 7 98 3" },
  { label: "Published", value: "948", change: "8.2%", note: "vs. last month", icon: "check", color: "bg-emerald-50 text-emerald-600", sparkline: "M2 25C12 20 19 24 28 17S43 20 54 12 68 16 78 10 89 12 98 4" },
  { label: "Drafts", value: "236", change: "4.6%", note: "vs. last month", icon: "edit", color: "bg-amber-50 text-amber-600", sparkline: "M2 26C13 27 18 17 29 21S43 11 54 16 68 9 77 13 88 5 98 7" },
  { label: "Total views", value: "84.2K", change: "18.2%", note: "vs. last month", icon: "eye", color: "bg-sky-50 text-sky-600", sparkline: "M2 28C12 25 17 27 28 19S42 23 51 14 66 18 76 8 89 11 98 2" },
] as const;
const recentContent = [
  { title: "Designing for the modern web", type: "Article", author: "Olivia Martin", initials: "OM", date: "Nov 08, 2026", status: "Published", views: "12,482" },
  { title: "A guide to creative direction", type: "Article", author: "Noah Williams", initials: "NW", date: "Nov 07, 2026", status: "Published", views: "8,941" },
  { title: "Q4 brand campaign", type: "Landing page", author: "Emma Davis", initials: "ED", date: "Nov 07, 2026", status: "In review", views: "—" },
  { title: "The future of digital products", type: "Article", author: "Liam Wilson", initials: "LW", date: "Nov 06, 2026", status: "Draft", views: "—" },
] as const;
const activities = [
  { initials: "OM", name: "Olivia", action: "published", subject: "Designing for the modern web", time: "12 min ago", color: "bg-violet-100 text-violet-700" },
  { initials: "NW", name: "Noah", action: "uploaded 6 files to", subject: "Media library", time: "48 min ago", color: "bg-sky-100 text-sky-700" },
  { initials: "ED", name: "Emma", action: "left a comment on", subject: "Q4 brand campaign", time: "2 hours ago", color: "bg-amber-100 text-amber-700" },
  { initials: "LW", name: "Liam", action: "created a new draft", subject: "The future of digital products", time: "4 hours ago", color: "bg-emerald-100 text-emerald-700" },
] as const;

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>;
}

function Brand() {
  return <a href="#overview" className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"><span className="grid size-9 place-items-center rounded-xl bg-violet-600 text-lg font-bold text-white shadow-sm shadow-violet-200">k</span><span className="text-xl font-bold tracking-[-0.04em] text-slate-900">kima<span className="text-violet-600">.</span></span></a>;
}

function NavigationList({ items }: { items: NavigationItem[] }) {
  return <ul className="space-y-1">{items.map((item) => <li key={item.label}><a href="#" popoverTarget="mobile-navigation" popoverTargetAction="hide" aria-current={item.active ? "page" : undefined} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-violet-600 ${item.active ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}><Icon name={item.icon} className="size-[18px]" /><span className="flex-1">{item.label}</span>{item.count && <span className={`rounded-md px-2 py-0.5 text-xs ${item.active ? "bg-violet-100" : "bg-slate-100 text-slate-500"}`}>{item.count}</span>}</a></li>)}</ul>;
}

function SidebarContent({ isMobile = false }: { isMobile?: boolean }) {
  return <><div className="flex items-center justify-between px-3"><Brand />{isMobile && <button type="button" popoverTarget="mobile-navigation" popoverTargetAction="hide" aria-label="Close navigation" className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-violet-600"><Icon name="close" /></button>}</div><nav aria-label={isMobile ? "Mobile navigation" : "Main navigation"} className="mt-10 flex-1"><p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace</p><NavigationList items={workspaceNavigation} /><p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Manage</p><NavigationList items={manageNavigation} /></nav><div className="rounded-2xl bg-slate-950 p-4 text-white"><div className="flex items-center justify-between"><span className="text-sm font-semibold">Storage</span><span className="text-xs text-slate-400">68%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-violet-400" /></div><p className="mt-3 text-xs leading-5 text-slate-400">6.8 GB of 10 GB used</p></div><div className="mt-5 flex items-center gap-3 border-t border-slate-100 px-2 pt-5"><span className="grid size-9 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">OM</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">Olivia Martin</p><p className="truncate text-xs text-slate-400">Administrator</p></div><button type="button" aria-label="Open profile menu" className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-violet-600"><Icon name="more" /></button></div></>;
}

function Sidebar() {
  return <><aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/80 bg-white px-4 py-6 lg:flex"><SidebarContent /></aside><aside id="mobile-navigation" popover="auto" className="flex-col bg-white px-4 py-6 lg:hidden"><SidebarContent isMobile /></aside></>;
}

function Header() {
  return <header className="flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6 lg:px-8"><div className="flex items-center gap-2 lg:hidden"><button type="button" popoverTarget="mobile-navigation" popoverTargetAction="show" aria-label="Open navigation" aria-controls="mobile-navigation" className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-600"><Icon name="menu" /></button><Brand /></div><div className="hidden items-center gap-2 text-sm lg:flex"><span className="text-slate-400">Workspace</span><span className="text-slate-300">/</span><span className="font-medium text-slate-700">Overview</span></div><div className="flex items-center gap-2 sm:gap-4"><label className="relative hidden md:block"><span className="sr-only">Search dashboard</span><Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input type="search" placeholder="Search anything..." className="h-10 w-56 rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 xl:w-64" /></label><button type="button" aria-label="Notifications, 3 unread" className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-violet-600"><Icon name="bell" className="size-[19px]" /><span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-violet-600 ring-2 ring-white" /></button><span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white shadow-sm">OM</span><form action={logoutAction}><button type="submit" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-600">Sign out</button></form></div></header>;
}

function PageHeading() {
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="mb-1 text-sm font-medium text-violet-600">Sunday, November 8</p><h1 className="text-2xl font-bold tracking-[-0.035em] text-slate-900 sm:text-[28px]">Good morning, Olivia</h1><p className="mt-1.5 text-sm text-slate-500">Here&apos;s what&apos;s happening with your content today.</p></div><button type="button" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:self-auto"><Icon name="plus" className="size-[18px]" />Create content</button></div>;
}

function MetricCards() {
  return <section aria-label="Content summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <article key={metric.label} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)]"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{metric.label}</p><p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900">{metric.value}</p></div><span className={`grid size-10 place-items-center rounded-xl ${metric.color}`}><Icon name={metric.icon} className="size-[19px]" /></span></div><div className="mt-4 flex items-end justify-between gap-3"><div><p className="flex items-center gap-1 text-xs font-semibold text-emerald-600"><Icon name="arrowUp" className="size-3.5" />{metric.change}</p><p className="mt-1 text-[11px] text-slate-400">{metric.note}</p></div><svg aria-hidden="true" viewBox="0 0 100 32" className="h-8 w-24 overflow-visible"><path d={metric.sparkline} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={metric.color.split(" ")[1]} /></svg></div></article>)}</section>;
}

function PerformanceChart() {
  return <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold text-slate-900">Content performance</h2><p className="mt-1 text-sm text-slate-400">Views across all published content</p></div><span className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600"><Icon name="clock" className="size-3.5 text-slate-400" />Last 30 days</span></div><div className="mt-6 flex items-end gap-6"><div><p className="text-2xl font-bold tracking-tight text-slate-900">84,210</p><p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600"><Icon name="trending" className="size-3.5" />18.2% <span className="font-normal text-slate-400">from last period</span></p></div><div className="mb-1 flex items-center gap-4 text-xs text-slate-400"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet-600" />Views</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet-200" />Visitors</span></div></div><div className="mt-5 flex gap-3"><div className="flex h-44 flex-col justify-between pb-5 text-[10px] text-slate-400"><span>4K</span><span>3K</span><span>2K</span><span>1K</span><span>0</span></div><div className="min-w-0 flex-1"><svg role="img" aria-label="Views increased from 1,200 to 3,800 over the last 30 days" viewBox="0 0 600 180" preserveAspectRatio="none" className="h-44 w-full overflow-visible"><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" /><stop offset="100%" stopColor="#7c3aed" stopOpacity="0" /></linearGradient></defs>{[10, 50, 90, 130, 170].map((y) => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#e9ebf2" strokeDasharray="4 5" />)}<path d="M0 150C30 146 48 130 75 134S120 110 150 116 198 128 225 102 270 72 300 88 345 110 375 78 420 42 450 59 495 72 525 40 570 30 600 16V180H0Z" fill="url(#chart-fill)" /><path d="M0 150C30 146 48 130 75 134S120 110 150 116 198 128 225 102 270 72 300 88 345 110 375 78 420 42 450 59 495 72 525 40 570 30 600 16" fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" /><circle cx="600" cy="16" r="5" fill="#7c3aed" stroke="white" strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg><div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>Oct 10</span><span>Oct 16</span><span>Oct 22</span><span>Oct 28</span><span>Nov 03</span><span>Nov 08</span></div></div></div></section>;
}

function ActivityFeed() {
  return <section id="activity" className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><h2 className="font-semibold text-slate-900">Recent activity</h2><button type="button" aria-label="More activity options" className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-violet-600"><Icon name="more" /></button></div><ol className="mt-6 space-y-6">{activities.map((activity, index) => <li key={`${activity.name}-${activity.time}`} className="relative flex gap-3">{index < activities.length - 1 && <span aria-hidden="true" className="absolute left-[17px] top-10 h-[calc(100%+8px)] w-px bg-slate-100" />}<span className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-bold ${activity.color}`}>{activity.initials}</span><div className="min-w-0 pt-0.5"><p className="text-sm leading-5 text-slate-500"><span className="font-medium text-slate-800">{activity.name}</span> {activity.action} <span className="font-medium text-slate-700">{activity.subject}</span></p><p className="mt-1 text-xs text-slate-400">{activity.time}</p></div></li>)}</ol><button type="button" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-600">View all activity<Icon name="arrowRight" className="size-3.5" /></button></section>;
}

function statusClass(status: string) {
  const classes = { Published: "bg-emerald-50 text-emerald-700", "In review": "bg-amber-50 text-amber-700", Draft: "bg-slate-100 text-slate-600" };
  return classes[status as keyof typeof classes] ?? classes.Draft;
}

function RecentContent() {
  return <section id="recent-content" className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white"><div className="flex items-center justify-between p-5 sm:p-6"><div><h2 className="font-semibold text-slate-900">Recent content</h2><p className="mt-1 text-sm text-slate-400">Your latest articles and pages</p></div><a href="#recent-content" className="flex items-center gap-1.5 rounded-lg text-xs font-semibold text-violet-600 hover:text-violet-800 focus-visible:outline-2 focus-visible:outline-violet-600">View all<Icon name="arrowRight" className="size-3.5" /></a></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left"><thead><tr className="border-y border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400"><th scope="col" className="px-6 py-3">Content</th><th scope="col" className="px-4 py-3">Author</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3">Views</th><th scope="col" className="px-4 py-3">Last updated</th><th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-slate-100">{recentContent.map((item) => <tr key={item.title} className="group hover:bg-slate-50/60"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-500"><Icon name="file" className="size-4" /></span><div><p className="max-w-[240px] truncate text-sm font-medium text-slate-800">{item.title}</p><p className="mt-0.5 text-xs text-slate-400">{item.type}</p></div></div></td><td className="px-4 py-4"><div className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-slate-100 text-[8px] font-bold text-slate-600">{item.initials}</span><span className="whitespace-nowrap text-xs text-slate-600">{item.author}</span></div></td><td className="px-4 py-4"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClass(item.status)}`}>{item.status}</span></td><td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">{item.views}</td><td className="whitespace-nowrap px-4 py-4 text-xs text-slate-400">{item.date}</td><td className="px-6 py-4 text-right"><button type="button" aria-label={`Actions for ${item.title}`} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-violet-600"><Icon name="more" className="size-4" /></button></td></tr>)}</tbody></table></div></section>;
}

export default function Home() {
  return <div id="overview" className="min-h-screen bg-[#f7f8fc] lg:pl-64"><Sidebar /><div className="min-w-0"><Header /><main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8"><PageHeading /><MetricCards /><div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)]"><PerformanceChart /><ActivityFeed /></div><RecentContent /></main></div></div>;
}
