import './more-dropdown.css';
import React from 'dom-chef';
import select from 'select-dom';
import elementReady from 'element-ready';
import * as pageDetect from 'github-url-detection';

import features from '.';
import getDefaultBranch from '../github-helpers/get-default-branch';
import {buildRepoURL, getCurrentBranch} from '../github-helpers';

/* eslint-disable-next-line import/prefer-default-export */
export function createDropdownItem(label: string, url: string, attributes?: Record<string, string>): Element {
	return (
		<li {...attributes}>
			<a role="menuitem" className="dropdown-item" href={url}>
				{label}
			</a>
		</li>
	);
}

function onlyShowInDropdown(id: string): void {
	select(`[data-tab-item$="${id}"]`)!.parentElement!.remove();
	const menuItem = select(`[data-menu-item$="${id}"]`)!;
	menuItem.removeAttribute('data-menu-item');
	menuItem.hidden = false;

	// The item has to be moved somewhere else because the overflow nav is order-dependent
	select('.js-responsive-underlinenav-overflow ul')!.append(menuItem);
}

async function init(): Promise<void> {
	// Wait for the tab bar to be loaded
	await elementReady('.UnderlineNav-body');

	const reference = getCurrentBranch() ?? await getDefaultBranch();
	const compareUrl = buildRepoURL('compare', reference);
	const commitsUrl = buildRepoURL('commits', reference);
	const branchesUrl = buildRepoURL('branches');
	const dependenciesUrl = buildRepoURL('network/dependencies');

	select('.js-responsive-underlinenav .UnderlineNav-body')!.parentElement!.classList.add('rgh-has-more-dropdown');

	select('.js-responsive-underlinenav-overflow ul')!.append(
		<li className="dropdown-divider" role="separator"/>,
		createDropdownItem('Compare', compareUrl),
		pageDetect.isEnterprise() ? '' : createDropdownItem('Dependencies', dependenciesUrl),
		createDropdownItem('Commits', commitsUrl),
		createDropdownItem('Branches', branchesUrl)
	);

	onlyShowInDropdown('security-tab');
	onlyShowInDropdown('insights-tab');
}

void features.add(__filebasename, {
	include: [
		pageDetect.isRepo
	],
	awaitDomReady: false,
	init
});
