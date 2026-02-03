"use client"

import { useEffect, useRef, useState } from "react"
import { Editor, EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import content from "@/components/tiptap-templates/simple/data/content.json"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import SelectCategory from "@/app/components/SelectCategory"
import { toast } from "sonner"


const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
export function SimpleEditor() {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slug, setSlug] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); const [title, setTitle] = useState('');
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content,
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })
  const handleSave = async (editor: Editor, title: string, thumbnail: File, categories: number[]) => {
    if (!editor || !title || !thumbnail) {
      alert("Please provide a title, thumbnail, and content");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", editor.getHTML());
    formData.append("thumbnail", thumbnail);
    formData.append("categories", JSON.stringify(categories.map(el => Number(el))));
    formData.append("slug", slug)
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BLOG_API_URL}/posts`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Post created:", data);
      }
      else {
        const errorData = await response.json();
        console.error("Save failed:", errorData.error);
      }

    } catch (error) {
      console.error("Network error:", error);
    }
    finally {
      setIsSubmitting(false);
      toast.success('Post saved successfully')
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);

    if (file) {
      const url = URL.createObjectURL(file);
      console.log(url)
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };
  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])
  const [category, setCategory] = useState([])
  return (
    <div className="w-full flex gap-7">
      <div className="simple-editor-wrapper p-7">
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input id="title" onChange={handleTitleChange}></Input>
        </Field>
        <EditorContext.Provider value={{ editor }}>
          <Toolbar
            ref={toolbarRef}
            style={{
              ...(isMobile
                ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
                : {}),
            }}
          >
            {mobileView === "main" ? (
              <MainToolbarContent
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                isMobile={isMobile}
              />
            ) : (
              <MobileToolbarContent
                type={mobileView === "highlighter" ? "highlighter" : "link"}
                onBack={() => setMobileView("main")}
              />
            )}
          </Toolbar>

          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content"
          />
        </EditorContext.Provider>
      </div>
      <aside className="py-7 flex flex-col gap-4 w-62.5" >
        <div className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Post Slug</FieldLabel>
            <Input id="slug" type="text" onChange={(e) => setSlug(e.target.value)} value={slug} />
          </Field>
        </div>
        <div className="thumbnail-upload">
          <Field>
            <FieldLabel>Thumbnail</FieldLabel>
            <Input id="picture" type="file" onChange={handleFileChange} />
            <FieldDescription>Select a picture to</FieldDescription>
          </Field>
          <div className="relative aspect-video mb-2 overflow-hidden rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="text-center p-4">
                <p className="text-xs text-muted-foreground text-balance">
                  No image selected. This will be the cover photo.
                </p>
              </div>
            )}
          </div>
          {thumbnail && (
            <p style={{ fontSize: '12px', marginTop: '5px' }}>
              Selected: {thumbnail.name}
            </p>
          )}
        </div>
        <div className="w-full">
          <SelectCategory onCategoryChange={(value) => setCategory(prev => [...prev, value])} />
          <div className="flex gap-7">
            <span className="text-gray-300">
              Selected categories: {category.join(", ")}
            </span>
          </div>
        </div>
        <Button
          onClick={() => handleSave(editor, title, thumbnail, category)}
          disabled={isSubmitting}
          style={{ backgroundColor: '#007bff', color: 'white' }}
        >
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </Button>
      </aside>
    </div>
  )
}
