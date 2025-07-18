"use client";
import React, { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest", api: "-published_at" },
  { value: "oldest", label: "Oldest", api: "published_at" },
];

export default function IdeasListClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Responsiveness: inject style tag for media queries
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 900px) {
        .ideas-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
      @media (max-width: 600px) {
        .ideas-grid { grid-template-columns: 1fr !important; }
        .ideas-controls { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        .ideas-pagination { justify-content: center !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Ambil state dari query params
  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);
  const sort = searchParams.get("sort") || "newest";

  // Fetch data dari API proxy
  useEffect(() => {
    setLoading(true);
    const sortApi = SORT_OPTIONS.find((s) => s.value === sort)?.api || "-published_at";
    const url = `/api/ideas?page[number]=${page}&page[size]=${size}&append[]=small_image&append[]=medium_image&sort=${sortApi}`;
    console.log("test",url);
    fetch(url)
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, [page, size, sort]);

  // Handler untuk update query params
  function updateParams(params) {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) newParams.delete(key);
      else newParams.set(key, value);
    });
    startTransition(() => {
      router.replace(`?${newParams.toString()}`);
    });
  }

  // Pagination logic
  const total = data?.meta?.total || 0;
  const totalPages = Math.ceil(total / size);
  const posts = data?.data || [];
  const startIdx = (page - 1) * size + 1;
  const endIdx = Math.min(page * size, total);

  return (
    <div>
      {/* Header info & controls */}
      <div className="ideas-controls">
        <div className="ideas-controls-info">
          {loading ? 'Loading...' : `Showing ${startIdx} - ${endIdx} of ${total}`}
        </div>
        <div className="ideas-controls-actions">
          <label className="ideas-controls-label">
            Show per page:
            <select
              className="ideas-controls-select"
              value={size}
              onChange={e => updateParams({ size: e.target.value, page: 1 })}
            >
              {PAGE_SIZE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="ideas-controls-label">
            Sort by:
            <select
              className="ideas-controls-select"
              value={sort}
              onChange={e => updateParams({ sort: e.target.value, page: 1 })}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {/* Grid list */}
      <div className="ideas-grid">
        {(loading || isPending) ? (
          Array.from({ length: size }).map((_, i) => (
            <div key={i} className="ideas-card" style={{ background: '#f3f3f3' }} />
          ))
        ) : posts.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: 40 }}>
            No ideas found.
          </div>
        ) : posts.map((item) => {
          // Ambil url dari array gambar, fallback ke gambar default jika tidak ada
          let img = (item.medium_image && item.medium_image[0] && item.medium_image[0].url)
            || (item.small_image && item.small_image[0] && item.small_image[0].url)
            || '/window.svg';
          if (img) img = `/api/image?url=${encodeURIComponent(img)}`;
          console.log('img:', img, 'medium:', item.medium_image, 'small:', item.small_image, 'title:', item.title);
          return (
            <div key={item.id} className="ideas-card">
              <div className="ideas-card-thumb">
                {img ? (
                  <img
                    src={img}
                    alt={item.title}
                    loading="lazy"
                    className="ideas-card-img"
                    onError={e => {
                      console.error("Image failed to load:", img);
                      e.target.onerror = null;
                      e.target.src = '/window.svg';
                    }}
                  />
                ) : (
                  <img
                    src="/window.svg"
                    alt="No Thumbnail"
                    className="ideas-card-img"
                  />
                )}
              </div>
              <div className="ideas-card-info">
                <div className="ideas-card-date">
                  {formatDate(item.published_at)}
                </div>
                <div className="ideas-card-title" title={item.title}>
                  {item.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ideas-pagination">
          <nav className="ideas-pagination-nav">
            <button
              className={`ideas-pagination-btn${page === 1 ? '' : ''}`}
              disabled={page === 1}
              onClick={() => updateParams({ page: page - 1 })}
            >{'<'}</button>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`ideas-pagination-btn${page === p ? ' active' : ''}`}
                  onClick={() => updateParams({ page: p })}
                >
                  {p}
                </button>
              );
            })}
            {totalPages > 5 && (
              <span className="ideas-pagination-ellipsis">...</span>
            )}
            <button
              className={`ideas-pagination-btn${page === totalPages ? '' : ''}`}
              disabled={page === totalPages}
              onClick={() => updateParams({ page: page + 1 })}
            >{'>'}</button>
          </nav>
        </div>
      )}
    </div>
  );
} 