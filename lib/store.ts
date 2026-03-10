export interface HeadingStyle {
  fontSize?: string
  fontWeight?: string
  lineHeight?: string
  letterSpacing?: string
  fontFamily?: string
  textTransform?: string
  color?: string
}

export interface ComponentDefinition {
  description?: string
  props?: string[]
  className?: string
}

export interface DesignTokens {
  colors?: Record<string, string>
  spacing?: Record<string, string>
  shadows?: Record<string, string>
  typography?: Record<string, string>
  borderRadius?: Record<string, string>
  zIndex?: Record<string, string>
  headingStyles?: Record<string, HeadingStyle>
  components?: Record<string, ComponentDefinition>
}

export interface GeneratedVariant {
  id: string
  name: string
  description: string
  html: string
  style: 'editorial' | 'action' | 'minimalist'
  sectionType?: 'navbar' | 'hero' | 'features' | 'pricing' | 'testimonials' | 'cta' | 'footer' | 'contact' | 'faq'
}

export interface ComponentRequest {
  id: string
  prompt: string
  type: 'component' | 'section' | 'page'
  variants: GeneratedVariant[]
  createdAt: Date
  approvalLink?: string
}

export interface UploadedFile {
  id: string
  name: string
  type: 'css' | 'json' | 'image'
  uploadedAt: Date
  content: string
}

export interface Project {
  id: string
  name: string
  clientName: string
  createdAt: Date
  updatedAt: Date
  designTokens: DesignTokens
  cssContent?: string
  jsonContent?: string
  screenshotUrl?: string  // Visual reference of client's website
  clientUrl?: string       // Client's website URL
  uploadedFiles: UploadedFile[]
  requests: ComponentRequest[]
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function createProject(name: string, clientName: string): Project {
  return {
    id: generateId(),
    name,
    clientName,
    createdAt: new Date(),
    updatedAt: new Date(),
    designTokens: {},
    uploadedFiles: [],
    requests: [],
  }
}

export function createRequest(
  prompt: string,
  type: 'component' | 'section' | 'page'
): ComponentRequest {
  return {
    id: generateId(),
    prompt,
    type,
    variants: [],
    createdAt: new Date(),
  }
}
