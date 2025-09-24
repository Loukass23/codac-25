'use client';

import { Project } from '@prisma/client';
import { Value } from 'platejs';
import { use } from 'react';
import { toast } from 'sonner';

import { updateProjectSummary } from '../../actions/projects/update-project-summary';
import { jsonToPlateValue } from '../../lib/plate/utils';
import { PlateEditor } from '../editor/plate-editor';

function ProjectContent({
  _projectPromise,
}: {
  _projectPromise: Promise<Project>;
}) {
  const project = use(_projectPromise);
  const plateValue = jsonToPlateValue(project.summary);
  const handleSave = async (value: Value) => {
    try {
      const result = await updateProjectSummary(project.id, value);

      if (result.success) {
        toast.success('Project summary saved successfully!');
      } else {
        toast.error(result.error ?? 'Failed to save project summary');
      }
    } catch (_error) {
      toast.error('An unexpected error occurred while saving');
    }
  };

  return (
    <div>
      <PlateEditor initialValue={plateValue} onSave={handleSave} />
      {/* <ProjectSummaryEditor projectId={project.id} initialValue={plateValue} /> */}
    </div>
  );
}

export default ProjectContent;
