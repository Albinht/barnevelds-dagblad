export enum ArticleStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  WRITER = 'WRITER',
  MODERATOR = 'MODERATOR'
}

export interface WorkflowTransition {
  from: ArticleStatus
  to: ArticleStatus
  requiredRole: UserRole
  requiresApproval?: boolean
}

export interface ContentWorkflow {
  transitions: WorkflowTransition[]
  getAvailableTransitions(currentStatus: ArticleStatus, userRole: UserRole): ArticleStatus[]
  canTransition(from: ArticleStatus, to: ArticleStatus, userRole: UserRole): boolean
  requiresApproval(from: ArticleStatus, to: ArticleStatus): boolean
}

export const defaultWorkflowTransitions: WorkflowTransition[] = [
  // Draft transitions
  { from: ArticleStatus.DRAFT, to: ArticleStatus.REVIEW, requiredRole: UserRole.WRITER },
  { from: ArticleStatus.DRAFT, to: ArticleStatus.PUBLISHED, requiredRole: UserRole.ADMIN },
  
  // Review transitions
  { from: ArticleStatus.REVIEW, to: ArticleStatus.DRAFT, requiredRole: UserRole.EDITOR },
  { from: ArticleStatus.REVIEW, to: ArticleStatus.APPROVED, requiredRole: UserRole.EDITOR },
  
  // Approved transitions
  { from: ArticleStatus.APPROVED, to: ArticleStatus.PUBLISHED, requiredRole: UserRole.EDITOR },
  { from: ArticleStatus.APPROVED, to: ArticleStatus.DRAFT, requiredRole: UserRole.EDITOR },
  
  // Published transitions
  { from: ArticleStatus.PUBLISHED, to: ArticleStatus.ARCHIVED, requiredRole: UserRole.EDITOR },
  { from: ArticleStatus.PUBLISHED, to: ArticleStatus.DRAFT, requiredRole: UserRole.ADMIN },
  
  // Archived transitions
  { from: ArticleStatus.ARCHIVED, to: ArticleStatus.PUBLISHED, requiredRole: UserRole.ADMIN },
]

export class ContentWorkflowService implements ContentWorkflow {
  constructor(
    public transitions: WorkflowTransition[] = defaultWorkflowTransitions
  ) {}

  getAvailableTransitions(currentStatus: ArticleStatus, userRole: UserRole): ArticleStatus[] {
    return this.transitions
      .filter(t => t.from === currentStatus && this.hasRequiredRole(userRole, t.requiredRole))
      .map(t => t.to)
  }

  canTransition(from: ArticleStatus, to: ArticleStatus, userRole: UserRole): boolean {
    const transition = this.transitions.find(t => t.from === from && t.to === to)
    return transition ? this.hasRequiredRole(userRole, transition.requiredRole) : false
  }

  requiresApproval(from: ArticleStatus, to: ArticleStatus): boolean {
    const transition = this.transitions.find(t => t.from === from && t.to === to)
    return transition?.requiresApproval || false
  }

  private hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.WRITER]: 1,
      [UserRole.MODERATOR]: 2,
      [UserRole.EDITOR]: 3,
      [UserRole.ADMIN]: 4
    }

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  }

  // Get next logical status for workflow automation
  getNextStatus(currentStatus: ArticleStatus, userRole: UserRole): ArticleStatus | null {
    const availableTransitions = this.getAvailableTransitions(currentStatus, userRole)
    
    // Logic for automatic progression
    switch (currentStatus) {
      case ArticleStatus.DRAFT:
        return availableTransitions.includes(ArticleStatus.REVIEW) ? ArticleStatus.REVIEW : null
      case ArticleStatus.REVIEW:
        return availableTransitions.includes(ArticleStatus.APPROVED) ? ArticleStatus.APPROVED : null
      case ArticleStatus.APPROVED:
        return availableTransitions.includes(ArticleStatus.PUBLISHED) ? ArticleStatus.PUBLISHED : null
      default:
        return null
    }
  }

  // Validate status transition with logging
  async validateTransition(
    articleId: string,
    from: ArticleStatus,
    to: ArticleStatus,
    userRole: UserRole,
    userId: string
  ): Promise<{ valid: boolean; reason?: string }> {
    if (!this.canTransition(from, to, userRole)) {
      return {
        valid: false,
        reason: `User role ${userRole} cannot transition article from ${from} to ${to}`
      }
    }

    // Additional business logic validation can be added here
    // For example: checking if article has required fields for publication

    return { valid: true }
  }
}

export const contentWorkflow = new ContentWorkflowService()