import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Tag, Loader2, GalleryVerticalEnd, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { getPillarsCards } from "../constants/cardConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PillarList } from "../components/PillarList";
import { ContentCategoryList } from "../components/ContentCategoryList";
import { PlatformList } from "../components/PlatformList";
import { DeleteModal } from "@/features/tasks/components/DeleteModal";
import { PillarFormModal } from "../components/PillarFormModal";
import { ContentCategoryFormModal } from "../components/ContentCategoryFormModal";
import { PlatformFormModal } from "../components/PlatformFormModal";
import {
  getPillarsApi,
  createPillarApi,
  updatePillarApi,
  deletePillarApi,
  type Pillar,
} from "../api/pillarsApi";
import {
  getContentCategoriesApi,
  createContentCategoryApi,
  updateContentCategoryApi,
  deleteContentCategoryApi,
  type ContentCategory,
} from "@/features/contents/api/contentCategoriesApi";
import {
  getPlatformsApi,
  createPlatformApi,
  updatePlatformApi,
  deletePlatformApi,
  type Platform,
} from "@/features/platforms/api/platformsApi";

export function PillarsPage() {
  const queryClient = useQueryClient();

  // Queries
  const { data: pillars = [], isLoading: isPillarsLoading } = useQuery<
    Pillar[]
  >({
    queryKey: ["pillars"],
    queryFn: () => getPillarsApi({ include_inactive: true }),
  });

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<
    ContentCategory[]
  >({
    queryKey: ["content-categories"],
    queryFn: () => getContentCategoriesApi({ include_inactive: true }),
  });

  const { data: platforms = [], isLoading: isPlatformsLoading } = useQuery<
    Platform[]
  >({
    queryKey: ["platforms"],
    queryFn: () => getPlatformsApi({ include_inactive: true }),
  });

  // Modal States - Pillars
  const [isPillarModalOpen, setIsPillarModalOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<Pillar | null>(null);

  // Modal States - Categories
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ContentCategory | null>(null);

  // Modal States - Platforms
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"pillar" | "category" | "platform" | null>(
    null,
  );
  const [itemToDelete, setItemToDelete] = useState<
    Pillar | ContentCategory | Platform | null
  >(null);

  // Search & Filter States - Pillars
  const [pillarSearch, setPillarSearch] = useState("");
  const [pillarStatus, setPillarStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Search & Filter States - Categories
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryStatus, setCategoryStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Search & Filter States - Platforms
  const [platformSearch, setPlatformSearch] = useState("");
  const [platformStatus, setPlatformStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filteredPillars = useMemo(() => {
    return pillars.filter((p) => {
      const matchesSearch =
        p.pillar_name.toLowerCase().includes(pillarSearch.toLowerCase()) ||
        (p.description || "")
          .toLowerCase()
          .includes(pillarSearch.toLowerCase());
      const matchesStatus =
        pillarStatus === "all"
          ? true
          : pillarStatus === "active"
            ? p.is_active
            : !p.is_active;
      return matchesSearch && matchesStatus;
    });
  }, [pillars, pillarSearch, pillarStatus]);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch = c.type_name
        .toLowerCase()
        .includes(categorySearch.toLowerCase());
      const matchesStatus =
        categoryStatus === "all"
          ? true
          : categoryStatus === "active"
            ? c.is_active
            : !c.is_active;
      return matchesSearch && matchesStatus;
    });
  }, [categories, categorySearch, categoryStatus]);

  const filteredPlatforms = useMemo(() => {
    return platforms.filter((pl) => {
      const matchesSearch = pl.platform_name
        .toLowerCase()
        .includes(platformSearch.toLowerCase());
      const matchesStatus =
        platformStatus === "all"
          ? true
          : platformStatus === "active"
            ? pl.is_active
            : !pl.is_active;
      return matchesSearch && matchesStatus;
    });
  }, [platforms, platformSearch, platformStatus]);

  // Mutations - Pillars
  const createPillarMutation = useMutation({
    mutationFn: createPillarApi,
    onSuccess: () => {
      toast.success("Pillar berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["pillars"] });
      setIsPillarModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal menambahkan pillar");
    },
  });

  const updatePillarMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { pillar_name?: string; description?: string; is_active?: boolean; color_key?: string | null };
    }) => updatePillarApi(id, data),
    onSuccess: () => {
      toast.success("Pillar berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["pillars"] });
      setIsPillarModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal memperbarui pillar");
    },
  });

  const deletePillarMutation = useMutation({
    mutationFn: deletePillarApi,
    onSuccess: () => {
      toast.success("Pillar berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["pillars"] });
      setIsDeleteModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal menghapus pillar");
    },
  });

  // Mutations - Categories
  const createCategoryMutation = useMutation({
    mutationFn: createContentCategoryApi,
    onSuccess: () => {
      toast.success("Kategori berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["content-categories"] });
      setIsCategoryModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal menambahkan kategori");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { type_name?: string; is_active?: boolean; color_key?: string | null };
    }) => updateContentCategoryApi(id, data),
    onSuccess: () => {
      toast.success("Kategori berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["content-categories"] });
      setIsCategoryModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal memperbarui kategori");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteContentCategoryApi,
    onSuccess: () => {
      toast.success("Kategori berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["content-categories"] });
      setIsDeleteModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal menghapus kategori");
    },
  });

  // Mutations - Platforms
  const createPlatformMutation = useMutation({
    mutationFn: createPlatformApi,
    onSuccess: () => {
      toast.success("Platform berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
      setIsPlatformModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal menambahkan platform");
    },
  });

  const updatePlatformMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { platform_name?: string; is_active?: boolean; color_key?: string | null };
    }) => updatePlatformApi(id, data),
    onSuccess: () => {
      toast.success("Platform berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
      setIsPlatformModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal memperbarui platform");
    },
  });

  const deletePlatformMutation = useMutation({
    mutationFn: deletePlatformApi,
    onSuccess: () => {
      toast.success("Platform berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
      setIsDeleteModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal menghapus platform");
    },
  });

  // Pillar Action Handlers
  const handleAddPillarClick = () => {
    setEditingPillar(null);
    setIsPillarModalOpen(true);
  };

  const handleEditPillarClick = (pillar: Pillar) => {
    setEditingPillar(pillar);
    setIsPillarModalOpen(true);
  };

  const handleDeletePillarClick = (pillar: Pillar) => {
    setDeleteType("pillar");
    setItemToDelete(pillar);
    setIsDeleteModalOpen(true);
  };

  const handlePillarSave = (data: {
    pillar_name: string;
    description: string;
    color_key: string | null;
    is_active: boolean;
  }) => {
    if (editingPillar) {
      updatePillarMutation.mutate({
        id: editingPillar.id,
        data,
      });
    } else {
      createPillarMutation.mutate({
        pillar_name: data.pillar_name,
        description: data.description,
        color_key: data.color_key,
      });
    }
  };

  // Category Action Handlers
  const handleAddCategoryClick = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategoryClick = (category: ContentCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategoryClick = (category: ContentCategory) => {
    setDeleteType("category");
    setItemToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleCategorySave = (data: {
    type_name: string;
    color_key: string | null;
    is_active: boolean;
  }) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({
        id: editingCategory.id,
        data,
      });
    } else {
      createCategoryMutation.mutate({
        type_name: data.type_name,
        color_key: data.color_key,
      });
    }
  };

  // Platform Action Handlers
  const handleAddPlatformClick = () => {
    setEditingPlatform(null);
    setIsPlatformModalOpen(true);
  };

  const handleEditPlatformClick = (platform: Platform) => {
    setEditingPlatform(platform);
    setIsPlatformModalOpen(true);
  };

  const handleDeletePlatformClick = (platform: Platform) => {
    setDeleteType("platform");
    setItemToDelete(platform);
    setIsDeleteModalOpen(true);
  };

  const handlePlatformSave = (data: {
    platform_name: string;
    color_key: string | null;
    is_active: boolean;
  }) => {
    if (editingPlatform) {
      updatePlatformMutation.mutate({
        id: editingPlatform.id,
        data,
      });
    } else {
      createPlatformMutation.mutate({
        platform_name: data.platform_name,
        color_key: data.color_key,
      });
    }
  };

  // Confirm Delete Handler
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (deleteType === "pillar") {
      deletePillarMutation.mutate(itemToDelete.id);
    } else if (deleteType === "category") {
      deleteCategoryMutation.mutate(itemToDelete.id);
    } else if (deleteType === "platform") {
      deletePlatformMutation.mutate(itemToDelete.id);
    }
  };

  const isDataLoading = isPillarsLoading || isCategoriesLoading || isPlatformsLoading;

  return (
    <div className="space-y-6">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {getPillarsCards(pillars, categories, platforms, isDataLoading).map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      {isDataLoading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-red-800" />
            <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
              Loading Data...
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Pillars List Section */}
            <div className="bg-white rounded-2xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 flex flex-col gap-4 h-137.5 lg:col-span-8">
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <GalleryVerticalEnd className="h-5 w-5 text-red-800" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Content Pillars
                  </h2>
                </div>
                <Button
                  onClick={handleAddPillarClick}
                  className="bg-red-800 hover:bg-red-900 text-white rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer shadow-sm text-xs font-semibold h-9"
                >
                  <Plus className="h-4 w-4" />
                  Add Pillar
                </Button>
              </div>
              
              {/* Search & Filter Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Input
                  placeholder="Search pillar name or description..."
                  value={pillarSearch}
                  onChange={(e) => setPillarSearch(e.target.value)}
                  className="h-9 text-xs border border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-red-800 transition-colors bg-white focus:outline-none"
                />
                <Select
                  value={pillarStatus}
                  onValueChange={(val) =>
                    setPillarStatus(val as "all" | "active" | "inactive")
                  }
                >
                  <SelectTrigger className="w-full sm:w-36 h-9 text-xs font-semibold border-gray-200 bg-gray-50/50 rounded-lg">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-100 shadow-md rounded-lg">
                    <SelectItem
                      value="all"
                      className="text-xs font-medium cursor-pointer"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value="active"
                      className="text-xs font-medium cursor-pointer text-green-600"
                    >
                      Active
                    </SelectItem>
                    <SelectItem
                      value="inactive"
                      className="text-xs font-medium cursor-pointer text-gray-500"
                    >
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <PillarList
                pillars={filteredPillars}
                onEdit={handleEditPillarClick}
                onDelete={handleDeletePillarClick}
              />
            </div>

            {/* Content Categories List Section */}
            <div className="bg-white rounded-2xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 flex flex-col gap-4 h-137.5 lg:col-span-4">
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-red-800" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Content Categories
                  </h2>
                </div>
                <Button
                  onClick={handleAddCategoryClick}
                  className="bg-red-800 hover:bg-red-900 text-white rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer shadow-sm text-xs font-semibold h-9"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </div>

              {/* Search & Filter Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Input
                  placeholder="Search category name..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="h-9 text-xs border border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-red-800 transition-colors bg-white focus:outline-none"
                />
                <Select
                  value={categoryStatus}
                  onValueChange={(val) =>
                    setCategoryStatus(val as "all" | "active" | "inactive")
                  }
                >
                  <SelectTrigger className="w-full sm:w-36 h-9 text-xs font-semibold border-gray-200 bg-gray-50/50 rounded-lg">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-100 shadow-md rounded-lg">
                    <SelectItem
                      value="all"
                      className="text-xs font-medium cursor-pointer"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value="active"
                      className="text-xs font-medium cursor-pointer text-green-600"
                    >
                      Active
                    </SelectItem>
                    <SelectItem
                      value="inactive"
                      className="text-xs font-medium cursor-pointer text-gray-500"
                    >
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ContentCategoryList
                categories={filteredCategories}
                onEdit={handleEditCategoryClick}
                onDelete={handleDeleteCategoryClick}
              />
            </div>
          </div>

          {/* Social Platforms List Section (2-column layout container) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 flex flex-col gap-4 h-137.5">
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-red-800" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Social Platforms
                  </h2>
                </div>
                <Button
                  onClick={handleAddPlatformClick}
                  className="bg-red-800 hover:bg-red-900 text-white rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer shadow-sm text-xs font-semibold h-9"
                >
                  <Plus className="h-4 w-4" />
                  Add Platform
                </Button>
              </div>

              {/* Search & Filter Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Input
                  placeholder="Search platform name..."
                  value={platformSearch}
                  onChange={(e) => setPlatformSearch(e.target.value)}
                  className="h-9 text-xs border border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-red-800 transition-colors bg-white focus:outline-none"
                />
                <Select
                  value={platformStatus}
                  onValueChange={(val) =>
                    setPlatformStatus(val as "all" | "active" | "inactive")
                  }
                >
                  <SelectTrigger className="w-full sm:w-36 h-9 text-xs font-semibold border-gray-200 bg-gray-50/50 rounded-lg">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-100 shadow-md rounded-lg">
                    <SelectItem
                      value="all"
                      className="text-xs font-medium cursor-pointer"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value="active"
                      className="text-xs font-medium cursor-pointer text-green-600"
                    >
                      Active
                    </SelectItem>
                    <SelectItem
                      value="inactive"
                      className="text-xs font-medium cursor-pointer text-gray-500"
                    >
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <PlatformList
                platforms={filteredPlatforms}
                onEdit={handleEditPlatformClick}
                onDelete={handleDeletePlatformClick}
              />
            </div>
            {/* Right column empty space for future development */}
            <div className="hidden lg:block" />
          </div>
        </div>
      )}

      {/* Pillar Form Modal */}
      {isPillarModalOpen && (
        <PillarFormModal
          isOpen={isPillarModalOpen}
          onClose={() => setIsPillarModalOpen(false)}
          editingPillar={editingPillar}
          onSave={handlePillarSave}
          isPending={createPillarMutation.isPending || updatePillarMutation.isPending}
        />
      )}

      {/* Category Form Modal */}
      {isCategoryModalOpen && (
        <ContentCategoryFormModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          editingCategory={editingCategory}
          onSave={handleCategorySave}
          isPending={createCategoryMutation.isPending || updateCategoryMutation.isPending}
        />
      )}

      {/* Platform Form Modal */}
      {isPlatformModalOpen && (
        <PlatformFormModal
          isOpen={isPlatformModalOpen}
          onClose={() => setIsPlatformModalOpen(false)}
          editingPlatform={editingPlatform}
          onSave={handlePlatformSave}
          isPending={createPlatformMutation.isPending || updatePlatformMutation.isPending}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={
          deleteType === "pillar"
            ? "Delete Content Pillar?"
            : deleteType === "category"
              ? "Delete Content Category?"
              : "Delete Social Platform?"
        }
        description={
          itemToDelete ? (
            <>
              Are you sure you want to delete{" "}
              {deleteType === "pillar"
                ? "content pillar"
                : deleteType === "category"
                  ? "content category"
                  : "social platform"}{" "}
              <span className="font-semibold text-gray-800">
                &quot;
                {deleteType === "pillar"
                  ? (itemToDelete as Pillar).pillar_name
                  : deleteType === "category"
                    ? (itemToDelete as ContentCategory).type_name
                    : (itemToDelete as Platform).platform_name}
                &quot;
              </span>
              ? This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
      />
    </div>
  );
}
