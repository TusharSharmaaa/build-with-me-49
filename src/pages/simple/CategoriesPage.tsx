import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/system/AppLayout";
import { supabase, withRetry, isSupabaseConfigured } from "@/lib/supabase-service";

export function CategoriesPage() {
  const { data: professions, isLoading } = useQuery({
    queryKey: ["professions"],
    queryFn: () =>
      withRetry(() =>
        supabase
          .from("professions")
          .select("*")
          .order("name")
          .then((res) => {
            if (res.error) throw res.error;
            return res.data;
          })
      ),
    enabled: isSupabaseConfigured(),
  });

  if (!isSupabaseConfigured()) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p>Configuration Missing</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : professions && professions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {professions.map((prof) => (
              <Link
                key={prof.id}
                to={`/category/${prof.slug}`}
                className="border border-border rounded-2xl p-6 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <h3 className="text-lg font-semibold">{prof.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">Explore tools</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No categories available.</p>
        )}
      </div>
    </AppLayout>
  );
}
