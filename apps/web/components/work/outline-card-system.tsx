"use client";

import { useCallback, useState } from "react";
import { CardSystem, CardContainerType } from "./base-card-system";
import type { BaseCardProps } from "./base-card-system";
import { 
  OutlineDialog,
  VolumeSelectDialog,
  ChapterSelectDialog,
  ContentEditDialog
} from "@/components/dialogs/outline-dialogs";

// 大纲卡片系统属性
interface OutlineCardSystemProps {
  volumes: Array<{ id: string; title: string }>;
  availableChapters: Array<{ id: string; title: string }>;
  isMobile?: boolean;
  onChapterClick?: (chapterId: string) => void;
}

export function OutlineCardSystem({
  volumes = [],
  availableChapters = [],
  isMobile = false,
  onChapterClick,
}: OutlineCardSystemProps) {
  // 对话框状态
  const [outlineDialogOpen, setOutlineDialogOpen] = useState(false);
  const [volumeDialogOpen, setVolumeDialogOpen] = useState(false);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);

  // 卡片数据状态
  const [cards, setCards] = useState<BaseCardProps[]>([]);

  // 添加卡片
  const handleAddCard = useCallback((containerType: CardContainerType, title?: string) => {
    // 页面级添加按钮，创建大纲集合卡片
    setOutlineDialogOpen(true);
  }, []);

  // 确认添加大纲卡片
  const handleConfirmAddOutline = useCallback((data: { content: string }) => {
    const newCard: BaseCardProps = {
      id: `outline-${Date.now()}`,
      title: "故事大纲",
      content: data.content,
      type: "outline",
      tag: "outline", // 标签为outline
      isCollapsed: false,
      containerType: CardContainerType.COLLECTION,
      childCards: [],
      showEditButton: true,
      showAddButton: true,
      showDeleteButton: true,
      showRelateButton: false,
    };
    setCards(prev => [...prev, newCard]);
  }, []);

  // 更新卡片
  const handleUpdateCard = useCallback((id: string, updates: Partial<BaseCardProps>) => {
    setCards(prev => prev.map(card => {
      // 更新主卡片
      if (card.id === id) {
        return { ...card, ...updates };
      }
      
      // 如果是集合类卡片，检查其子卡片
      if (card.containerType === CardContainerType.COLLECTION && card.childCards) {
        const updatedChildCards = card.childCards.map(childCard => {
          if (childCard.id === id) {
            return { ...childCard, ...updates };
          }
          
          // 检查三级卡片（子卡片的子卡片）
          if (childCard.containerType === CardContainerType.COLLECTION && childCard.childCards) {
            const updatedGrandChildCards = childCard.childCards.map(grandChildCard => 
              grandChildCard.id === id ? { ...grandChildCard, ...updates } : grandChildCard
            );
            return { ...childCard, childCards: updatedGrandChildCards };
          }
          
          return childCard;
        });
        return { ...card, childCards: updatedChildCards };
      }
      
      return card;
    }));
  }, []);

  // 删除卡片
  const handleDeleteCard = useCallback((id: string) => {
    setCards(prev => {
      // 递归函数，用于删除任何层级的卡片
      const removeCardById = (cards: BaseCardProps[]): BaseCardProps[] => {
        // 过滤掉要删除的卡片
        const filtered = cards.filter(card => card.id !== id);
        
        // 处理子卡片
        return filtered.map(card => {
          if (card.containerType === CardContainerType.COLLECTION && card.childCards) {
            return {
              ...card,
              childCards: removeCardById(card.childCards)
            };
          }
          return card;
        });
      };
      
      return removeCardById(prev);
    });
  }, []);

  // 添加子卡片到父卡片的辅助函数
  const addChildCardToParent = useCallback((parentId: string, childCard: BaseCardProps) => {
    setCards(prev => {
      const updateCardWithChild = (cards: BaseCardProps[]): BaseCardProps[] => {
        return cards.map(card => {
          if (card.id === parentId) {
            return {
              ...card,
              childCards: [...(card.childCards || []), childCard]
            };
          }
          
          if (card.containerType === CardContainerType.COLLECTION && card.childCards) {
            return {
              ...card,
              childCards: updateCardWithChild(card.childCards)
            };
          }
          
          return card;
        });
      };
      
      return updateCardWithChild(prev);
    });
  }, []);

  // 添加子卡片
  const handleAddChildCard = useCallback((parentId: string, containerType: CardContainerType, title?: string, hideTitle = false) => {
    console.log("OUTLINE handleAddChildCard called:", { parentId, containerType, title, hideTitle });
    
    // 首先获取父卡片，以确定其标签
    const findParentCard = (cards: BaseCardProps[]): BaseCardProps | null => {
      for (const card of cards) {
        if (card.id === parentId) return card;
        
        if (card.containerType === CardContainerType.COLLECTION && card.childCards) {
          const found = findParentCard(card.childCards);
          if (found) return found;
        }
      }
      return null;
    };
    
    const parentCard = findParentCard(cards);
    if (!parentCard) {
      console.error("Parent card not found:", parentId);
      return;
    }
    
    console.log("Parent card found:", parentCard);
    setCurrentParentId(parentId);
    
    // 根据父卡片的标签和选择的容器类型决定创建什么类型的子卡片
    if (containerType === CardContainerType.EDITOR) {
      // 如果选择的是编辑器类卡片，直接打开内容对话框
      setContentDialogOpen(true);
      
      // 为编辑器卡片创建一个临时ID
      const tempId = `outline-editor-${Date.now()}`;
      setCurrentCardId(tempId);
      
      // 创建编辑器卡片
      const newCard: BaseCardProps = {
        id: tempId,
        title: title || "内容卡片", // 即使隐藏标题也设置一个默认标题
        content: "",
        type: "content",
        tag: `${parentCard.tag}-editor`,
        isCollapsed: false,
        containerType: CardContainerType.EDITOR,
        hideTitle: hideTitle, // 根据参数决定是否隐藏标题
        showEditButton: !hideTitle, // 如果显示标题则显示编辑按钮
        showAddButton: false,
        showDeleteButton: true,
        showRelateButton: true,
      };
      
      console.log("Creating outline editor card:", { hideTitle, newCard });
      
      // 更新父卡片，添加新的编辑器卡片
      addChildCardToParent(parentId, newCard);
    } else if (parentCard.tag === "outline") {
      // 如果父卡片标签是outline，打开分卷选择对话框
      setVolumeDialogOpen(true);
    } else if (parentCard.tag === "outline-volume") {
      // 如果父卡片标签是outline-volume，打开章节选择对话框
      setChapterDialogOpen(true);
    } else if (containerType === CardContainerType.COLLECTION) {
      // 其他集合类卡片
      const newCard: BaseCardProps = {
        id: `${parentCard.tag}-collection-${Date.now()}`,
        title: title || "子卡片",
        content: "",
        type: "collection",
        tag: `${parentCard.tag}-collection`,
        isCollapsed: false,
        containerType: CardContainerType.COLLECTION,
        childCards: [],
        showEditButton: true,
        showAddButton: true,
        showDeleteButton: true,
        showRelateButton: false
      };
      
      // 更新父卡片，添加新的集合卡片
      addChildCardToParent(parentId, newCard);
    }
  }, [cards, setCurrentParentId, setVolumeDialogOpen, setChapterDialogOpen, addChildCardToParent]);

  // 确认添加分卷大纲
  const handleConfirmAddVolumeOutline = useCallback((volumeId: string) => {
    if (!currentParentId) return;

    const selectedVolume = volumes.find(v => v.id === volumeId);
    if (!selectedVolume) return;
    
    const newChildCard: BaseCardProps = {
      id: `outline-volume-${Date.now()}`,
      title: `${selectedVolume.title}大纲`,
      content: "",
      type: "volume",
      tag: "outline-volume", // 标签为outline-volume
      isCollapsed: false,
      containerType: CardContainerType.COLLECTION, // 分卷大纲是集合类卡片
      childCards: [],
      showEditButton: true,
      showAddButton: true,
      showDeleteButton: true,
      showRelateButton: true,
      relatedItem: {
        id: volumeId,
        title: selectedVolume.title,
        type: "volume",
      }
    };
    
    // 更新父卡片，添加新的子卡片
    addChildCardToParent(currentParentId, newChildCard);
    setContentDialogOpen(true);
    setCurrentCardId(newChildCard.id);
  }, [currentParentId, volumes, addChildCardToParent]);

  // 确认添加章节大纲
  const handleConfirmAddChapterOutline = useCallback((chapterId: string) => {
    if (!currentParentId) return;

    const selectedChapter = availableChapters.find(c => c.id === chapterId);
    if (!selectedChapter) return;

    const newChildCard: BaseCardProps = {
      id: `outline-chapter-${Date.now()}`,
      title: `${selectedChapter.title}大纲`,
      content: "",
      type: "chapter",
      tag: "outline-chapter", // 标签为outline-chapter
      isCollapsed: false,
      containerType: CardContainerType.EDITOR, // 章节大纲是编辑器类卡片
      hideTitle: true, // 默认隐藏标题
      showEditButton: false,
      showAddButton: false,
      showDeleteButton: true,
      showRelateButton: true,
      relatedItem: {
        id: chapterId,
        title: selectedChapter.title,
        type: "chapter",
      }
    };
    
    // 更新父卡片，添加新的子卡片
    addChildCardToParent(currentParentId, newChildCard);
    setContentDialogOpen(true);
    setCurrentCardId(newChildCard.id);
  }, [currentParentId, availableChapters, addChildCardToParent]);

  // 确认添加内容
  const handleConfirmAddContent = useCallback((content: string) => {
    if (!currentCardId) return;
    
    // 递归更新卡片内容
    const updateCardContent = (cards: BaseCardProps[]): BaseCardProps[] => {
      return cards.map(card => {
        if (card.id === currentCardId) {
          return { ...card, content };
        }
        
        if (card.containerType === CardContainerType.COLLECTION && card.childCards) {
          return {
            ...card,
            childCards: updateCardContent(card.childCards)
          };
        }
        
        return card;
      });
    };
    
    setCards(updateCardContent);
  }, [currentCardId]);

  // 关联卡片
  const handleRelateCard = useCallback((id: string) => {
    // 首先查找卡片类型
    const findCard = (cards: BaseCardProps[]): BaseCardProps | null => {
      for (const card of cards) {
        if (card.id === id) return card;
        
        if (card.containerType === CardContainerType.COLLECTION && card.childCards) {
          const found = findCard(card.childCards);
          if (found) return found;
        }
      }
      return null;
    };
    
    const card = findCard(cards);
    if (!card) return;
    
    setCurrentCardId(id);
    
    if (card.type === "volume") {
      setVolumeDialogOpen(true);
    } else if (card.type === "chapter") {
      setChapterDialogOpen(true);
    }
  }, [cards]);

  // 解除关联
  const handleUnrelateCard = useCallback((id: string) => {
    handleUpdateCard(id, { relatedItem: undefined });
  }, [handleUpdateCard]);

  // 移动卡片
  const handleMoveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards(prev => {
      const newCards = [...prev];
      const [removed] = newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, removed);
      return newCards;
    });
  }, []);

  // 处理章节点击
  const handleChapterClick = useCallback((chapterId: string) => {
    if (onChapterClick) {
      onChapterClick(chapterId);
    }
  }, [onChapterClick]);

  // 对话框关闭时清除当前状态
  const handleDialogClose = useCallback((setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(false);
    setCurrentCardId(null);
    setCurrentParentId(null);
  }, []);

  return (
    <>
      <CardSystem
        cards={cards}
        title="故事大纲"
        onAddCard={handleAddCard}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onAddChildCard={handleAddChildCard}
        onRelateCard={handleRelateCard}
        onUnrelateCard={handleUnrelateCard}
        moveCard={handleMoveCard}
        isMobile={isMobile}
        addButtonText="添加大纲"
        buttonsConfig={{
          showEditButton: true,
          showAddButton: true,
          showDeleteButton: true,
          showRelateButton: true
        }}
      />

      <OutlineDialog 
        open={outlineDialogOpen} 
        onOpenChange={(open) => !open && handleDialogClose(setOutlineDialogOpen)}
        onConfirm={handleConfirmAddOutline}
      />
      
      <VolumeSelectDialog 
        open={volumeDialogOpen} 
        onOpenChange={(open) => !open && handleDialogClose(setVolumeDialogOpen)}
        onConfirm={handleConfirmAddVolumeOutline}
        volumes={volumes}
      />
      
      <ChapterSelectDialog 
        open={chapterDialogOpen} 
        onOpenChange={(open) => !open && handleDialogClose(setChapterDialogOpen)}
        onConfirm={handleConfirmAddChapterOutline}
        chapters={availableChapters}
      />

      <ContentEditDialog 
        open={contentDialogOpen}
        onOpenChange={(open) => !open && handleDialogClose(setContentDialogOpen)}
        onConfirm={handleConfirmAddContent}
        title="编辑内容"
      />
    </>
  );
}
