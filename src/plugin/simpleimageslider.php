<?php
/*
 * @copyright  Copyright (C) 2015 Marco Beierer. All rights reserved.
 * @license    http://www.gnu.org/licenses/agpl-3.0.html GNU/AGPL
 */

defined('_JEXEC') or die();

class plgContentSimpleimageslider extends JPlugin {

	public function onContentPrepare($context, &$article, &$params, $page) {

		$pattern = '/\{simpleimageslider (.*)\}/';

		if (preg_match($pattern, $article->text) !== 1) {
			return;
		}
		
		JHTML::_('bootstrap.framework'); // TODO necessary or is jQuery enough?

		$doc = JFactory::getDocument();
		$doc->addScript('media/plg_content_simpleimageslider/simpleimageslider.js');
		$doc->addStyleSheet('media/plg_content_simpleimageslider/simpleimageslider.css');


		$path = JPluginHelper::getLayoutPath('content', 'simpleimageslider');
		$replacement = file_get_contents($path);

		$lang = JFactory::getLanguage();
		$lang->load('plg_content_simpleimageslider', JPATH_ADMINISTRATOR);

		$replacement = preg_replace('/SIS_LOADING/', JText::_('PLG_CONTENT_SIMPLEIMAGESLIDER_LOADING'), $replacement);
		$replacement = preg_replace('/SIS_IMAGE/', JText::_('PLG_CONTENT_SIMPLEIMAGESLIDER_IMAGE'), $replacement);
		$replacement = preg_replace('/SIS_OF/', JText::_('PLG_CONTENT_SIMPLEIMAGESLIDER_OF'), $replacement);

		$replacement = preg_replace('/SIS_BASEPATH/', JURI::base(), $replacement);

		$article->text = preg_replace($pattern, $replacement, $article->text); // TODO use preg_quote for $replacement?
	}
}
